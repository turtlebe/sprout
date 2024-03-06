import { mockFarmDefMachine } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { render } from '@testing-library/react';

import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';

import { CanvasLayer, dataTestCanvasLayerIds } from '.';

jest.mock('../../hooks/use-vertical-grow-graph-api');
jest.mock('@plentyag/app-production/src/maps-interactive-page/utils');

describe('CanvasLayer', () => {
  let mockRenderTrack, mockRenderTowers;

  const mockGetCropColor = jest.fn();
  const mockMapState = {}; // empty mock state

  beforeEach(() => {
    mockRenderTrack = jest.fn();
    mockRenderTowers = jest.fn();
    (useVerticalGrowGraphApi as jest.Mock).mockReturnValue({
      renderTrack: mockRenderTrack,
      renderTowers: mockRenderTowers,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders element executing rendering the graph', () => {
    // ACT 1
    const { queryByTestId } = render(
      <CanvasLayer
        getCropColor={mockGetCropColor}
        mapsState={mockMapState}
        machine={mockFarmDefMachine}
        width={100}
        height={200}
        towerWidth={3}
      />
    );

    // ASSERT 1
    expect(queryByTestId(dataTestCanvasLayerIds.container)).toBeInTheDocument();
    expect(mockRenderTrack).toHaveBeenCalled();
    expect(mockRenderTowers).toHaveBeenCalled();
  });
});
