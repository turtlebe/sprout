import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { useGerminationRackGraphApi } from '../../hooks/use-germination-rack-graph-api';

import { dataTestIdsGerminationRackGraph, GerminationRackGraph } from '.';

jest.mock('../../hooks/use-germination-rack-graph-api');
jest.mock('@plentyag/core/src/hooks/use-resize-observer');

const mockGetCropColor = jest.fn();
const mockMapState = {}; // empty mock state

// -- mock data
const containerLocations = {
  [mockFarmDefContainerLocations.name]: mockFarmDefContainerLocations,
};

function renderGerminationRackGraph() {
  return render(
    <GerminationRackGraph
      getCropColor={mockGetCropColor}
      mapsState={mockMapState}
      containerLocations={containerLocations}
    />
  );
}

describe('GerminationRackDiagram', () => {
  let mockRenderGraph, mockClear;

  beforeEach(() => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    mockRenderGraph = jest.fn();
    mockClear = jest.fn();
    (useGerminationRackGraphApi as jest.Mock).mockReturnValue({
      clear: mockClear,
      renderGraph: mockRenderGraph,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderGerminationRackGraph();

    // ASSERT 1
    expect(queryByTestId(dataTestIdsGerminationRackGraph.container)).toBeInTheDocument();
    expect(mockRenderGraph).toHaveBeenCalledWith(expect.objectContaining({ containerLocations }));

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsGerminationRackGraph.container)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('does not render if width or height is not provided', () => {
    (useResizeObserver as jest.Mock)
      .mockReturnValueOnce({
        width: 100,
        height: undefined,
      })
      .mockReturnValueOnce({
        width: undefined,
        height: 100,
      })
      .mockReturnValueOnce({
        width: 100,
        height: 100,
      });

    // no height
    renderGerminationRackGraph();
    expect(mockRenderGraph).not.toHaveBeenCalled();

    // no width
    renderGerminationRackGraph();
    expect(mockRenderGraph).not.toHaveBeenCalled();

    // has both width and height
    renderGerminationRackGraph();
    expect(mockRenderGraph).toHaveBeenCalled();
  });
});
