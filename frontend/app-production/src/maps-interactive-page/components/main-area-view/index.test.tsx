import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import {
  mockAreaWithGerminationLine,
  mockAreaWithPropagationLine,
  mockAreaWithVerticalGrowLine,
  mockFarm,
  mockGerminationLine,
  mockPropagationLine,
  mockVerticalGrowLineGrowRoom1,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/farm-def-mocks';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { MemoryRouter } from 'react-router-dom';

import { useGetCropsColor, useLoadMapsLineData, useLoadMapsState } from '../../hooks';
import { useQueryParameter } from '../../hooks/use-query-parameter';
import { mockFarmDefMachineGermination } from '../../test-helpers/mock-farm-def-object-data';
import { mockMapStateForTable } from '../../test-helpers/mock-map-state-data';
import { GerminationLineView } from '../germination-line-view';
import { Header } from '../header';
import { HeaderToolbar } from '../header-toolbar';
import { dataTestIdsLegend } from '../legend';
import { PropagationRackView } from '../propagation-rack-view';
import { VerticalGrowRoomView } from '../vertical-grow-room-view';

import { dataTestIdsMainAreaView, MainAreaView } from '.';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');
jest.mock('../../hooks/use-load-maps-line-data');
jest.mock('../../hooks/use-load-maps-state');
jest.mock('../../hooks/use-get-crops-color');
jest.mock('../germination-line-view');
jest.mock('../propagation-rack-view');
jest.mock('../vertical-grow-room-view');
jest.mock('../header-toolbar');
jest.mock('../../hooks/use-query-parameter');
jest.mock('../header');

describe('MainContent', () => {
  const dataTestIdsGermLineView = 'mock-germ-line-view';
  const dataTestIdsPropRackView = 'mock-prop-rack-view';
  const dataTestIdsGrowRoomView = 'mock-vertical-grow-room-view';
  const dataTestIdsHeader = 'mock-header';

  const mockAgeCohortDate = new Date('2022-06-02');

  const mockSelectedDate = DateTime.fromSQL('2020-12-14');

  const mockRemoveSelectedDate = jest.fn();
  beforeEach(() => {
    (useMapsInteractiveRouting as jest.Mock).mockReturnValue({
      getMapsInteractiveRoute: jest.fn(),
      routeToMapsInterative: jest.fn(),
      removeSelectedDate: mockRemoveSelectedDate,
    });

    (useQueryParameter as jest.Mock).mockReturnValue({
      parameters: {
        ...mockDefaultQueryParameters,
        selectedDate: mockSelectedDate,
        ageCohortDate: mockAgeCohortDate,
      },
    });

    (GerminationLineView as jest.Mock).mockReturnValue(
      <div data-testid={dataTestIdsGermLineView}>mock germ line view</div>
    );
    (PropagationRackView as jest.Mock).mockReturnValue(
      <div data-testid={dataTestIdsPropRackView}>mock prop rack view</div>
    );
    (VerticalGrowRoomView as jest.Mock).mockReturnValue(
      <div data-testid={dataTestIdsGrowRoomView}>mock vertical grow room view</div>
    );
    (HeaderToolbar as jest.Mock).mockReturnValue(<div>mock filter toolbar</div>);
    (Header as jest.Mock).mockReturnValue(<div data-testid={dataTestIdsHeader}>mock header</div>);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  function renderMainAreaView(area, line) {
    const areas = area ? [area] : [];
    const lines = line ? [line] : [];
    return render(<MainAreaView farm={mockFarm} area={area} line={line} areas={areas} lines={lines} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  describe('Loading state', () => {
    beforeEach(() => {
      (useLoadMapsLineData as jest.Mock).mockReturnValue({
        machines: [],
        isLoading: true,
      });
      (useLoadMapsState as jest.Mock).mockReturnValue({
        mapsState: null,
        isLoading: true,
      });
      (useGetCropsColor as jest.Mock).mockReturnValue({
        isLoading: true,
        getCropColor: jest.fn(),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('initially renders and display loader', () => {
      // ACT
      const { queryByTestId } = renderMainAreaView(mockAreaWithGerminationLine, mockGerminationLine);

      // ASSERT
      expect(queryByTestId(dataTestIdsMainAreaView.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsMainAreaView.loading)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsHeader)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsLegend.root)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIdsGermLineView)).not.toBeInTheDocument();
    });
  });

  describe('Successful data state', () => {
    beforeEach(() => {
      (useLoadMapsLineData as jest.Mock).mockReturnValue({
        machines: [mockFarmDefMachineGermination],
        isLoading: false,
      });
      (useLoadMapsState as jest.Mock).mockReturnValue({
        mapsState: mockMapStateForTable,
        isLoading: false,
      });
      (useGetCropsColor as jest.Mock).mockReturnValue({
        isLoading: false,
        getCropColor: jest.fn(),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders germination view given the area class is "Germination" and line class is "GerminationLine"', () => {
      // ACT
      const { queryByTestId } = renderMainAreaView(mockAreaWithGerminationLine, mockGerminationLine);

      // ASSERT
      // -- common components
      expect(queryByTestId(dataTestIdsMainAreaView.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsMainAreaView.loading)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIdsHeader)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsLegend.root)).toBeInTheDocument();
      // -- germ component
      expect(queryByTestId(dataTestIdsGermLineView)).toBeInTheDocument();

      // renders with default query parameters
      expect(GerminationLineView).toHaveBeenCalledWith(
        expect.objectContaining({
          queryParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: mockSelectedDate,
            ageCohortDate: mockAgeCohortDate,
          },
        }),
        expect.anything()
      );
    });

    it('renders propagation view given the area class is "Propagation" and line class is "PropagationRack"', () => {
      // ACT
      const { queryByTestId } = renderMainAreaView(mockAreaWithPropagationLine, mockPropagationLine);

      // ASSERT
      expect(queryByTestId(dataTestIdsPropRackView)).toBeInTheDocument();

      // renders with default query parameters
      expect(PropagationRackView).toHaveBeenCalledWith(
        expect.objectContaining({
          queryParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: mockSelectedDate,
            ageCohortDate: mockAgeCohortDate,
          },
        }),
        expect.anything()
      );
    });

    it('renders vertical grow view given the area class is "VerticalGrow" and line class is "VerticalGrow"', () => {
      // ACT
      const { queryByTestId } = renderMainAreaView(mockAreaWithVerticalGrowLine, mockVerticalGrowLineGrowRoom1);

      // ASSERT
      expect(queryByTestId(dataTestIdsGrowRoomView)).toBeInTheDocument();

      // renders with default query parameters
      expect(VerticalGrowRoomView).toHaveBeenCalledWith(
        expect.objectContaining({
          queryParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: mockSelectedDate,
            ageCohortDate: mockAgeCohortDate,
          },
        }),
        expect.anything()
      );
    });

    it('fetches the correct parameters', () => {
      renderMainAreaView(mockAreaWithVerticalGrowLine, mockVerticalGrowLineGrowRoom1);

      expect(useLoadMapsState).toBeCalledWith(
        expect.objectContaining({
          selectedDate: mockSelectedDate,
          linePath: 'sites/SSF2/areas/Propagation/lines/GrowRoom1',
        })
      );

      // renders with selectedDate and other options as default
      expect(VerticalGrowRoomView).toHaveBeenCalledWith(
        expect.objectContaining({
          queryParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: mockSelectedDate,
            ageCohortDate: mockAgeCohortDate,
          },
        }),
        expect.anything()
      );
    });
  });
});
