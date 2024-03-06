import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { MemoryRouter } from 'react-router-dom';

import { useGetCropsColor } from '../../hooks';
import { mockFarmDefMachine } from '../../test-helpers/mock-farm-def-object-data';
import { mockMapStateForTower } from '../../test-helpers/mock-map-state-data';
import { ContainerDetailsDrawer } from '../container-details-drawer';
import { dataTestIdsTooltip } from '../container-summary-tooltip';

import { dataTestIdsVerticalGrowRoomView as dataTestIds, VerticalGrowRoomView } from '.';

import { dataTestGrowLineGraphIds } from './components/grow-line-graph';
import { dataTestSvgLayerIds } from './components/svg-layer';
import { dataTestIdsZoomedDrawer } from './components/zoomed-drawer';
import { HOT_SPOTS_CLASS } from './hooks/use-vertical-grow-graph-api/render-hotspots';

jest.mock('../../hooks/use-load-maps-state');
jest.mock('../../hooks/use-get-crops-color');
jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-load-maps-line-data');
jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('../container-details-drawer');

describe('VerticalGrowRoomView', () => {
  let selectedDate;
  const mockGetCropColor = jest.fn();

  const dataTestContainerDetailsDrawer = 'container-details-drawer-test-id';

  beforeEach(() => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 1000,
      height: 1000,
    });

    (useGetCropsColor as jest.Mock).mockReturnValue({
      isLoading: false,
      getCropColor: jest.fn(),
    });

    (ContainerDetailsDrawer as jest.Mock).mockReturnValue(
      <div data-testid={dataTestContainerDetailsDrawer}>mock details drawer</div>
    );

    selectedDate = DateTime.fromSQL('2020-12-14');
  });

  function renderVerticalGrowRoomView() {
    const machines = [mockFarmDefMachine];
    return render(
      <VerticalGrowRoomView
        machines={machines}
        mapsState={mockMapStateForTower}
        getCropColor={mockGetCropColor}
        queryParameters={{ ...mockDefaultQueryParameters, selectedDate }}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const { queryByTestId } = renderVerticalGrowRoomView();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  describe('interactions', () => {
    async function renderVerticalGrowRoomViewWithZoomedDrawerOpen() {
      // ARRANGE
      const dataTestIdSvgLayer = `${mockFarmDefMachine.name}:${dataTestGrowLineGraphIds.container}`;

      // ACT 1
      const queries = renderVerticalGrowRoomView();
      const { queryByTestId } = queries;

      // ASSERT 1
      expect(queryByTestId(dataTestIdsZoomedDrawer.container).getAttribute('aria-hidden')).toEqual('true');

      // ACT 2
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdSvgLayer)));

      // ASSERT 2
      expect(queryByTestId(dataTestIdsZoomedDrawer.container).getAttribute('aria-hidden')).toEqual('false');

      return queries;
    }

    it('should show and hide drawer', async () => {
      // ARRANGE
      const { queryByTestId } = await renderVerticalGrowRoomViewWithZoomedDrawerOpen();

      // ACT
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdsZoomedDrawer.close)));

      // ASSERT
      expect(queryByTestId(dataTestIdsZoomedDrawer.container).getAttribute('aria-hidden')).toEqual('true');
    });

    it('shows tooltips on mouse over and hides on mouse out', async () => {
      const { queryByTestId } = await renderVerticalGrowRoomViewWithZoomedDrawerOpen();

      // mouse over
      await actAndAwait(() =>
        fireEvent.mouseEnter(queryByTestId(dataTestSvgLayerIds.container).querySelector(`.${HOT_SPOTS_CLASS} rect`))
      );
      expect(queryByTestId(dataTestIdsTooltip.container)).toBeInTheDocument();

      // mouse out
      await actAndAwait(() =>
        fireEvent.mouseLeave(queryByTestId(dataTestSvgLayerIds.container).querySelector(`.${HOT_SPOTS_CLASS} rect`))
      );
      expect(queryByTestId(dataTestIdsTooltip.container)).not.toBeInTheDocument();
    });

    it('shows side drawer when tower is clicked on', async () => {
      const { queryByTestId } = await renderVerticalGrowRoomViewWithZoomedDrawerOpen();

      // ACT
      await actAndAwait(() =>
        fireEvent.click(queryByTestId(dataTestSvgLayerIds.container).querySelector(`.${HOT_SPOTS_CLASS} rect`))
      );

      // ASSERT
      expect(queryByTestId(dataTestContainerDetailsDrawer)).toBeInTheDocument();
    });
  });
});
