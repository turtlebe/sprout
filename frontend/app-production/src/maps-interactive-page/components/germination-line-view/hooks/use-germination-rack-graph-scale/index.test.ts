import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { renderHook } from '@testing-library/react-hooks';

import { useGerminationRackGraphScale } from '.';

describe('useGerminationRackGraphScale', () => {
  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ARRANGE
    const containerLocations = {
      [mockFarmDefContainerLocations.name]: mockFarmDefContainerLocations,
    };

    // ACT
    const { result } = renderHook(() =>
      useGerminationRackGraphScale({
        width: 100,
        height: 200,
        containerLocations,
      })
    );

    // ASSERT
    // -- test returned data
    expect(result.current).toEqual(
      expect.objectContaining({
        height: 200,
        width: 100,
        paddingX: 8,
        paddingY: 8,
      })
    );
    // -- test the "y scale"
    expect(result.current.y(1)).toEqual(200);
  });
});
