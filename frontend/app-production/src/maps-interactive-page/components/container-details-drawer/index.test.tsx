import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { dataTestIdsObjectTreeView, useFeatureFlag } from '@plentyag/brand-ui/src/components';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import { DateTime, Settings } from 'luxon';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsContainerList } from '../../components/container-list';
import {
  mockFarmDefContainerLocationsWithTable,
  mockFarmDefPropLevel1Machine,
} from '../../test-helpers/mock-farm-def-object-data';
import { mocksChildResources, mocksResourcesState } from '../../test-helpers/mock-maps-state';
import { ContainerData } from '../../types';
import { getLoadTime } from '../../utils';
import { dataTestIdsViewIrrigationButton } from '../irrigation-table-button';

import { ContainerDetailsDrawer, dataTestIdsDrawer } from '.';

import { TableGraph } from './components/table-graph';
import { TowerGraph } from './components/tower-graph';
import { TrayGraph } from './components/tray-graph';

jest.mock('@plentyag/brand-ui/src/components/feature-flag/hooks/use-feature-flag');
const mockUseFeatureFlag = useFeatureFlag as jest.Mock;
// mock turn on feature flag for testing irrigation table button
mockUseFeatureFlag.mockImplementation(() => true);

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');
const mockUseMapsInteractiveRouting = useMapsInteractiveRouting as jest.Mock;
const mockResourcesPageBasePath = '/production/resources';
mockUseMapsInteractiveRouting.mockReturnValue({ resourcesPageBasePath: mockResourcesPageBasePath });

jest.mock('../../utils/get-load-time');
const mockGetLoadTime = getLoadTime as jest.Mock;

jest.mock('./components/table-graph');
jest.mock('./components/tower-graph');
jest.mock('./components/tray-graph');

describe('ContainerDetailsDrawer', () => {
  const today = DateTime.now();
  const defaultMockData = {
    containerLocation: mockFarmDefContainerLocationsWithTable,
  };
  const mockTableGraphDataTestId = 'mock-table-graph';
  const mockTrayGraphDataTestId = 'mock-tray-graph';
  const mockTowerGraphDataTestId = 'mock-tower-graph';

  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  beforeEach(() => {
    (TableGraph as jest.Mock).mockReturnValue(<div data-testid={mockTableGraphDataTestId}>mock table graph</div>);
    (TrayGraph as jest.Mock).mockReturnValue(<div data-testid={mockTrayGraphDataTestId}>mock tray graph</div>);
    (TowerGraph as jest.Mock).mockReturnValue(<div data-testid={mockTowerGraphDataTestId}>mock tower graph</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderContainerDetailsDrawer(mockData: ContainerData) {
    const mockOnClose = jest.fn();

    const result = render(
      <ContainerDetailsDrawer data={mockData} onClose={mockOnClose} selectedDate={today} getCropColor={jest.fn()} />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );

    return { ...result, mockOnClose };
  }

  it('renders', () => {
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.overline)).toHaveTextContent(mockFarmDefContainerLocationsWithTable.name);
  });

  it('fires onClose when close icon is clicked', async () => {
    const { queryByTestId, mockOnClose } = renderContainerDetailsDrawer(defaultMockData);

    // ACT
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdsDrawer.close)));

    // ASSERT
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays title with line/machine/container-location', () => {
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.overline)).toHaveTextContent('TableGermination / GermChamber1 / Bay1');
  });

  it('displays title showing optional "positionInParent" for displaying a full tray location', () => {
    const { queryByTestId } = renderContainerDetailsDrawer({
      containerLocation: mockFarmDefContainerLocationsWithTable,
      positionInParent: 'A4',
    });

    expect(queryByTestId(dataTestIdsDrawer.overline)).toHaveTextContent('TableGermination / GermChamber1 / Bay1 / A4');
  });

  it('displays title indicating slot has empty table', () => {
    // container but no material
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksResourcesState[3],
    };
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.overline)).toHaveTextContent('TableGermination / GermChamber1 / Bay1');
    expect(queryByTestId(dataTestIdsDrawer.title)).toHaveTextContent('Empty table');
  });

  it('displays title indicating slot has no table', () => {
    // no container or material
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: undefined,
    };
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.overline)).toHaveTextContent('TableGermination / GermChamber1 / Bay1');
    expect(queryByTestId(dataTestIdsDrawer.title)).toHaveTextContent('Unoccupied slot');
  });

  it('displays title when slot has table with crop', () => {
    // container and material
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksResourcesState[0],
    };
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.title)).toHaveTextContent('Table with BAC');
  });

  it('shows link to serial', () => {
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksResourcesState[0],
    };
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.serialLink)).toHaveTextContent(mocksResourcesState[0].containerObj.serial);
    expect(queryByTestId(dataTestIdsDrawer.serialLink)).toHaveAttribute(
      'href',
      `${mockResourcesPageBasePath}?q=${mocksResourcesState[0].containerObj.serial}`
    );
  });

  it('shows time in room', () => {
    const mockOperation: ProdResources.Operation = {
      id: '1',
      type: 'Cult Load Prop Line',
      username: 'test user',
      endDt: '2020-12-10T18:13:57.000Z',
      startDt: '2020-12-10T18:13:57.000Z',
      machine: null,
      stateIn: null,
      stateOut: null,
      materialsConsumed: null,
      materialsCreated: null,
    };

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksResourcesState[0],
      lastLoadOperation: mockOperation,
    };
    renderContainerDetailsDrawer(defaultMockData);

    expect(mockGetLoadTime).toHaveBeenCalledWith(new Date(mockOperation.startDt), today);
  });

  describe('material attributes', () => {
    function getMockData(materialAttributes: ProdResources.MaterialAttributes | undefined) {
      const mockResourceStateWithMaterialAttributes = cloneDeep(mocksResourcesState[0]);
      mockResourceStateWithMaterialAttributes.materialAttributes = materialAttributes;

      return {
        containerLocation: mockFarmDefContainerLocationsWithTable,
        resourceState: mockResourceStateWithMaterialAttributes,
      };
    }

    it('shows material attributes', () => {
      const mockMaterialAttributes = {
        loadedInGermAt: '2022-12-30T02:24:34.560655Z',
        loadedInPropAt: '2022-12-31T20:35:10.638655Z',
      };

      const defaultMockData = getMockData(mockMaterialAttributes);

      const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

      expect(queryByTestId(dataTestIdsObjectTreeView.root)).toHaveTextContent(
        'Loaded In Germ At: 12/29/2022 06:24 PMLoaded In Prop At: 12/31/2022 12:35 PM'
      );
    });

    it('does not show material attributes when object is empty', () => {
      const mockMaterialAttributes = {};

      const defaultMockData = getMockData(mockMaterialAttributes);

      const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

      expect(queryByTestId(dataTestIdsObjectTreeView.root)).not.toBeInTheDocument();
    });

    it('does not show material attributes when it is undefined', () => {
      const defaultMockData = getMockData(undefined);

      const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

      expect(queryByTestId(dataTestIdsObjectTreeView.root)).not.toBeInTheDocument();
    });
  });

  it('shows container labels', () => {
    const mockResourceStateWithContainerLabels = cloneDeep(mocksResourcesState[0]);
    mockResourceStateWithContainerLabels.containerLabels = ['label1', 'label2'];

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithContainerLabels,
    };
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.containerLabels)).toHaveTextContent('label1, label2');
    expect(queryByTestId(dataTestIdsDrawer.materialLabels)).toHaveTextContent('no labels');
  });

  it('shows material labels', () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);
    mockResourceStateWithMaterialLabels.materialLabels = ['label1', 'label2'];

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
    };
    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsDrawer.materialLabels)).toHaveTextContent('label1, label2');
    expect(queryByTestId(dataTestIdsDrawer.containerLabels)).toHaveTextContent('no labels');
  });

  it('shows TableGraph when container type is "TABLE"', () => {
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksResourcesState[0], // table
    };

    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(mockTableGraphDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockTrayGraphDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockTowerGraphDataTestId)).not.toBeInTheDocument();
  });

  it('shows TrayGraph when container type is "TRAY"', () => {
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksChildResources[0], // tray
    };

    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(mockTrayGraphDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockTableGraphDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockTowerGraphDataTestId)).not.toBeInTheDocument();
  });

  it('shows container list if there is a conflict of containers', () => {
    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: null,
      conflicts: [
        {
          resourceState: mocksResourcesState[0],
        },
        {
          resourceState: mocksResourcesState[1],
        },
      ],
    };

    const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

    expect(queryByTestId(dataTestIdsContainerList.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsDrawer.errorIcon)).toBeInTheDocument();
  });

  describe('irrigationTableButton', () => {
    it('does not render irrigation table button', () => {
      const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

      // won't render button because mock data is for table in germ.
      expect(queryByTestId(dataTestIdsViewIrrigationButton.irrigationButton)).not.toBeInTheDocument();
    });

    it('renders irrigation table button', () => {
      // mock data for table in prop w/ material and loaded date, so table irrigation button is rendered
      const defaultMockData = {
        containerLocation: mockFarmDefPropLevel1Machine,
        resourceState: {
          ...mocksResourcesState[0],
          materialAttributes: {
            loadedInPropAt: '2021-02-11T00:10:36.582Z',
          },
        },
      };
      const { queryByTestId } = renderContainerDetailsDrawer(defaultMockData);

      expect(queryByTestId(dataTestIdsViewIrrigationButton.irrigationButton)).toBeInTheDocument();
    });
  });
});
