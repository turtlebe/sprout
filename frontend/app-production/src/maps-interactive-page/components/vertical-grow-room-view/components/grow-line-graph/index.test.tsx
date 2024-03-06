import { mockFarmDefMachine } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';

import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';

import { dataTestGrowLineGraphIds, GrowLineGraph } from '.';

jest.mock('../../hooks/use-vertical-grow-graph-api');
jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('@plentyag/app-production/src/maps-interactive-page/utils');

describe('GrowLineGraph', () => {
  let mockGetCropColor, mockMapState, mockZoomState, mockZoomRef, mockOnClick;

  beforeEach(() => {
    mockGetCropColor = jest.fn();
    mockMapState = {};
    mockZoomState = {}; // empty mock state
    mockZoomRef = {
      current: document.createElement('div'),
    };
    mockOnClick = jest.fn();

    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    (useVerticalGrowGraphApi as jest.Mock).mockReturnValue({
      renderTrack: jest.fn(),
      renderTowers: jest.fn(),
      renderAxis: jest.fn(),
      renderPins: jest.fn(),
      renderHighlight: jest.fn(),
      clear: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT 1
    const { queryByTestId } = render(
      <GrowLineGraph
        getCropColor={mockGetCropColor}
        mapsState={mockMapState}
        machine={mockFarmDefMachine}
        zoomRef={mockZoomRef}
        zoomState={mockZoomState}
        onClick={mockOnClick}
      />
    );

    // ASSERT 1
    expect(queryByTestId(dataTestGrowLineGraphIds.container)).toBeInTheDocument();
  });
});
