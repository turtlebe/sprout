import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { useMeasure } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { usePropagationLevelGraphApi } from '../../hooks/use-propagation-level-graph-api';

import { dataTestIdsPropagationLevelGraph, PropagationLevelGraph } from '.';

jest.mock('../../hooks/use-propagation-level-graph-api');
jest.mock('@plentyag/core/src/hooks/use-measure');

const mockGetCropColor = jest.fn();
const mockMapState = {}; // empty mock state

describe('PropagationLevelGraph', () => {
  let mockRenderGraph, mockClear;

  beforeEach(() => {
    (useMeasure as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    mockRenderGraph = jest.fn();
    mockClear = jest.fn();
    (usePropagationLevelGraphApi as jest.Mock).mockReturnValue({
      clear: mockClear,
      renderGraph: mockRenderGraph,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ARRANGE 1
    // -- mock data
    const containerLocations = {
      [mockFarmDefContainerLocations.name]: mockFarmDefContainerLocations,
    };

    // ACT 1
    const { queryByTestId, unmount } = render(
      <PropagationLevelGraph
        getCropColor={mockGetCropColor}
        mapsState={mockMapState}
        containerLocations={containerLocations}
        queryParameters={mockDefaultQueryParameters}
      />
    );

    // ASSERT 1
    expect(queryByTestId(dataTestIdsPropagationLevelGraph.container)).toBeInTheDocument();
    expect(mockRenderGraph).toHaveBeenCalledWith({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: mockMapState,
      queryParameters: mockDefaultQueryParameters,
    });

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsPropagationLevelGraph.container)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });
});
