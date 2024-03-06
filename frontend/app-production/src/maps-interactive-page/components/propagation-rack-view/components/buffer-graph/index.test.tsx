import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { render } from '@testing-library/react';
import React from 'react';

import { PropagationLevelGraph } from '../propagation-level-graph';

import { BufferGraph, dataTestIdsBufferGraph as dataTestIds } from '.';

jest.mock('../propagation-level-graph');
const mockPropagationLevelGraph = PropagationLevelGraph as jest.Mock;
mockPropagationLevelGraph.mockReturnValue(<div>mock prop diagram</div>);

const mockGetCropColor = jest.fn();

const mockMapsState = {}; // empty mock state

describe('BufferGraph', () => {
  it('renders', () => {
    const { queryByTestId } = render(
      <BufferGraph
        loadBufferState={mockMapsState}
        getCropColor={mockGetCropColor}
        loadBufferContainerLocation={mockFarmDefContainerLocations}
        queryParameters={mockDefaultQueryParameters}
      />
    );
    expect(queryByTestId(dataTestIds.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.displayName)).toHaveTextContent('Load Buffer');
    expect(mockPropagationLevelGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        containerLocations: { propLoadBuffer: mockFarmDefContainerLocations },
        getCropColor: mockGetCropColor,
        mapsState: mockMapsState,
      }),
      expect.anything()
    );
  });
});
