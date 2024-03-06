import { mockFarmDefMachine } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';

import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';

import { dataTestSvgLayerIds, SvgLayer } from '.';

jest.mock('../../hooks/use-vertical-grow-graph-api');
jest.mock('@plentyag/app-production/src/maps-interactive-page/utils');

describe('SvgLayer', () => {
  let mockRenderAxis,
    mockRenderHighlight,
    mockRenderHotSpots,
    mockRenderPins,
    mockZoomState,
    mockZoomRef,
    mockClear,
    mockOnClick,
    mockGetCropColor;

  beforeEach(() => {
    mockRenderAxis = jest.fn();
    mockRenderHighlight = jest.fn();
    mockRenderPins = jest.fn();
    mockRenderHotSpots = jest.fn();
    mockClear = jest.fn();
    mockOnClick = jest.fn();
    mockGetCropColor = jest.fn();

    mockZoomState = {}; // empty mock state
    mockZoomRef = {
      current: document.createElement('div'),
    };

    (useVerticalGrowGraphApi as jest.Mock).mockReturnValue({
      renderAxis: mockRenderAxis,
      renderHighlight: mockRenderHighlight,
      renderHotSpots: mockRenderHotSpots,
      renderPins: mockRenderPins,
      clear: mockClear,
    });
  });

  function renderSvgLayer(enableHotspot = false) {
    return render(
      <SvgLayer
        zoomRef={mockZoomRef}
        zoomState={mockZoomState}
        machine={mockFarmDefMachine}
        enableHotspot={enableHotspot}
        width={100}
        height={200}
        towerWidth={3}
        onClick={mockOnClick}
        getCropColor={mockGetCropColor}
      />
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderSvgLayer();

    // ASSERT 1
    expect(queryByTestId(dataTestSvgLayerIds.container)).toBeInTheDocument();
    expect(mockRenderAxis).toHaveBeenCalled();
    expect(mockRenderHighlight).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestSvgLayerIds.container)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('should handle click event', async () => {
    // ARRANGE
    const { queryByTestId } = renderSvgLayer();

    // ACT
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestSvgLayerIds.container)));

    // ASSERT
    expect(mockOnClick).toHaveBeenCalledWith(expect.anything(), mockFarmDefMachine);
  });

  it('should be able to render hot spots', () => {
    // ACT
    renderSvgLayer(true);

    // ASSERT
    expect(mockRenderHotSpots).toHaveBeenCalled();
  });

  it('calls `mockRenderPins`', () => {
    // ACT
    renderSvgLayer();

    // ASSERT
    expect(mockRenderPins).toHaveBeenCalled();
  });
});
