import { mockFarmDefMachine } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mockMapStateForTower } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-map-state-data';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';

import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';

import { dataTestGrowLineZoomedGraphIds, GrowLineZoomedGraph } from '.';

jest.mock('../../hooks/use-vertical-grow-graph-api');
jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('@plentyag/app-production/src/maps-interactive-page/utils');

describe('GrowLineZoomedGraph', () => {
  let mockGetCropColor, mockMapState, mockOnScroll, mockZoomRef;

  beforeEach(() => {
    mockGetCropColor = jest.fn();
    mockMapState = mockMapStateForTower;
    mockOnScroll = jest.fn();
    mockZoomRef = {
      current: document.createElement('div'),
    };

    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    (useVerticalGrowGraphApi as jest.Mock).mockReturnValue({
      renderTrack: jest.fn(),
      renderTowers: jest.fn(),
      renderHotSpots: jest.fn(),
      renderPins: jest.fn(),
      renderAxis: jest.fn(),
      renderHighlight: jest.fn(),
      clear: jest.fn(),
    });
  });

  function renderGrowLineZoomedGraph() {
    return render(
      <GrowLineZoomedGraph
        getCropColor={mockGetCropColor}
        mapsState={mockMapState}
        machine={mockFarmDefMachine}
        onScroll={mockOnScroll}
        ref={mockZoomRef}
      />
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderGrowLineZoomedGraph();

    // ASSERT
    expect(queryByTestId(dataTestGrowLineZoomedGraphIds.container)).toBeInTheDocument();
  });

  it('should handle scroll event', async () => {
    // ARRANGE
    const { queryByTestId } = renderGrowLineZoomedGraph();

    // ACT
    await actAndAwait(() =>
      fireEvent.scroll(queryByTestId(dataTestGrowLineZoomedGraphIds.container), { target: { scrollX: 234 } })
    );

    // ASSERT
    expect(mockOnScroll).toHaveBeenCalledWith(expect.anything(), mockFarmDefMachine);
  });
});
