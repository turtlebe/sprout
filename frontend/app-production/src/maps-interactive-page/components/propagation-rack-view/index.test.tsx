import { dataTestIdsMachineDiagram } from '@plentyag/app-production/src/maps-interactive-page/components/machine-diagram';
import { mockPropagationLine } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/farm-def-mocks';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockFarmDefContainerLocations,
  mockFarmDefPropLevel1Machine,
  mockFarmDefPropLevel2Machine,
  mockFarmDefPropLevel3Machine,
  mockFarmDefTailLiftMachine,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { useRef } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mockMapStateForTable } from '../../test-helpers/mock-map-state-data';
import { mocksResourcesState } from '../../test-helpers/mock-maps-state';
import { MapsState } from '../../types';
import { ContainerDetailsDrawer } from '../container-details-drawer';
import { TableGraph } from '../container-details-drawer/components/table-graph';
import { dataTestIdsTooltip } from '../container-summary-tooltip';

import { dataTestIdsPropagationRackView as dataTestIds, PropagationRackView } from '.';

import { dataTestIdsBufferGraph, dataTestIdsLiftGraph, PropagationLevelGraph } from './components';
import { useGetPropagationLoadBuffer } from './hooks';

jest.mock('./hooks/use-get-propagation-load-buffer');

jest.mock('./components/propagation-level-graph');
jest.mock('../container-details-drawer/components/table-graph');
jest.mock('../container-details-drawer');

describe('PropagationRackView', () => {
  const selectedDate = DateTime.fromSQL('2020-12-14');
  const mockGetCropColor = jest.fn();

  const dataTestIdPropagationLevelGraph = 'propagation-level-graph-test-id';
  const dataTestIdPropagationLevelGraphTable = 'propagation-level-graph-table-test-id';
  const dataTestContainerDetailsDrawer = 'container-details-drawer-test-id';

  beforeEach(() => {
    (PropagationLevelGraph as jest.Mock).mockImplementation(({ onTableEnter, onTableExit, onTableClick }) => {
      const ref = useRef(null);
      return (
        <div data-testid={dataTestIdPropagationLevelGraph}>
          <div
            ref={ref}
            data-testid={dataTestIdPropagationLevelGraphTable}
            onMouseEnter={() => {
              onTableEnter(null, ref.current, { containerLocation: mockFarmDefContainerLocations });
            }}
            onMouseLeave={() => {
              onTableExit(null, ref.current, { containerLocation: mockFarmDefContainerLocations });
            }}
            onClick={() => {
              onTableClick(null, ref.current, {
                containerLocation: mockFarmDefContainerLocations,
                resourceState: mockMapStateForTable,
              });
            }}
          >
            Table
          </div>
        </div>
      );
    });

    (ContainerDetailsDrawer as jest.Mock).mockReturnValue(
      <div data-testid={dataTestContainerDetailsDrawer}>mock details drawer</div>
    );

    (TableGraph as jest.Mock).mockReturnValue(<div>hi</div>);
  });

  function renderPropagationRackView(machines, mapsState = {}) {
    return render(
      <PropagationRackView
        line={mockPropagationLine}
        machines={machines}
        mapsState={mapsState}
        getCropColor={mockGetCropColor}
        queryParameters={{ ...mockDefaultQueryParameters, selectedDate }}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('renders initial loading view', () => {
    (useGetPropagationLoadBuffer as jest.Mock).mockReturnValue({
      loadBufferContainerLocation: undefined,
      loadBufferState: {},
      isLoading: true,
    });

    const { queryByTestId } = renderPropagationRackView([]);

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdPropagationLevelGraph)).not.toBeInTheDocument();
  });

  it('renders sorted list of racks', () => {
    const machines = [
      mockFarmDefPropLevel1Machine,
      mockFarmDefTailLiftMachine,
      mockFarmDefPropLevel3Machine,
      mockFarmDefPropLevel2Machine,
    ];

    (useGetPropagationLoadBuffer as jest.Mock).mockReturnValue({
      loadBufferContainerLocation: undefined,
      loadBufferState: undefined,
      isLoading: false,
    });

    const { queryByTestId, queryAllByTestId } = renderPropagationRackView(machines);

    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();

    // does not show buffer since no data was loaded by mock above.
    expect(queryByTestId(dataTestIdsBufferGraph.container)).not.toBeInTheDocument();

    // renders tail lift but no head lift
    const lifts = queryAllByTestId(dataTestIdsLiftGraph.displayName);
    expect(lifts).toHaveLength(1);
    expect(lifts[0]).toHaveTextContent(mockFarmDefTailLiftMachine.name);

    // shows three racks in order: 3, 2, 1.
    const propRacks = queryAllByTestId(dataTestIdsMachineDiagram.displayName);
    expect(propRacks).toHaveLength(3);
    expect(propRacks[0]).toHaveTextContent(mockFarmDefPropLevel3Machine.name);
    expect(propRacks[1]).toHaveTextContent(mockFarmDefPropLevel2Machine.name);
    expect(propRacks[2]).toHaveTextContent(mockFarmDefPropLevel1Machine.name);
  });

  it('renders buffer graph', () => {
    const machines = [
      mockFarmDefPropLevel1Machine,
      mockFarmDefTailLiftMachine,
      mockFarmDefPropLevel3Machine,
      mockFarmDefPropLevel2Machine,
    ];

    const mockLoadBufferState: MapsState = {
      'e929f6df-851e-46ad-9807-ecaa585eaaf0:containerLocation-PropagationRack1LoadBuffer': {
        resourceState: mocksResourcesState[0],
      },
    };
    const mockUseGetPropagationLoadBuffer = useGetPropagationLoadBuffer as jest.Mock;
    mockUseGetPropagationLoadBuffer.mockReturnValue({
      loadBufferContainerLocation: mockFarmDefContainerLocations,
      loadBufferState: mockLoadBufferState,
      isLoading: false,
    });

    const { queryByTestId } = renderPropagationRackView(machines);

    expect(queryByTestId(dataTestIdsBufferGraph.container)).toBeInTheDocument();
  });

  describe('interactions tests', () => {
    let machines;
    beforeEach(() => {
      // mock so only single prop level is shown, with no load buffer or lift table.
      machines = [mockFarmDefPropLevel1Machine];

      (useGetPropagationLoadBuffer as jest.Mock).mockReturnValue({
        loadBufferContainerLocation: undefined,
        loadBufferState: undefined,
        isLoading: false,
      });
    });

    it('shows tooltips on mouse over and hides on mouse out', async () => {
      const { queryByTestId } = renderPropagationRackView(machines);

      // mouse over
      await actAndAwait(() => fireEvent.mouseEnter(queryByTestId(dataTestIdPropagationLevelGraphTable)));
      expect(queryByTestId(dataTestIdsTooltip.container)).toBeInTheDocument();

      // mouse out
      await actAndAwait(() => fireEvent.mouseLeave(queryByTestId(dataTestIdPropagationLevelGraphTable)));
      expect(queryByTestId(dataTestIdsTooltip.container)).not.toBeInTheDocument();
    });

    it('shows drawer when table is clicked on', async () => {
      const { queryByTestId } = renderPropagationRackView(machines);

      // open
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdPropagationLevelGraphTable)));
      expect(queryByTestId(dataTestContainerDetailsDrawer)).toBeInTheDocument();
    });
  });
});
