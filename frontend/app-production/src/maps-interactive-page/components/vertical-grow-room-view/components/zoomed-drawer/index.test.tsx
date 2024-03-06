import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockFarmDefMachine } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';

import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';

import { dataTestIdsZoomedDrawer, ZoomedDrawer } from '.';

jest.mock('../../hooks/use-vertical-grow-graph-api');
jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('@plentyag/app-production/src/maps-interactive-page/utils');

describe('ZoomedDrawer', () => {
  let mockGetCropColor, mockMapState, mockOnScroll, mockOnClose, mockZoomRef;

  beforeEach(() => {
    mockGetCropColor = jest.fn();
    mockMapState = {};
    mockOnClose = jest.fn();
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

  function renderZoomedDrawer() {
    return render(
      <ZoomedDrawer
        machine={mockFarmDefMachine}
        mapsState={mockMapState}
        queryParameters={mockDefaultQueryParameters}
        getCropColor={mockGetCropColor}
        onClose={mockOnClose}
        onScroll={mockOnScroll}
        ref={mockZoomRef}
      />
    );
  }

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderZoomedDrawer();

    // ASSERT
    expect(queryByTestId(dataTestIdsZoomedDrawer.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsZoomedDrawer.title)).toHaveTextContent(mockFarmDefMachine.displayName);
  });

  it('should handle onClose event', async () => {
    // ARRANGE
    const { queryByTestId } = renderZoomedDrawer();

    // ACT
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdsZoomedDrawer.close)));

    // ASSERT
    expect(mockOnClose).toHaveBeenCalled();
  });
});
