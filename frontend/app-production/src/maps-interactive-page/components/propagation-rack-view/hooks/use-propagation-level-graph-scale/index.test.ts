import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { renderHook } from '@testing-library/react-hooks';

import { usePropagationLevelGraphScale } from '.';

describe('usePropagationLevelGraphScale', () => {
  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ARRANGE
    const containerLocations = {
      [mockFarmDefContainerLocations.name]: mockFarmDefContainerLocations,
    };
    // ACT
    const { result } = renderHook(() =>
      usePropagationLevelGraphScale({
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
        paddingX: 5,
        paddingY: 15,
      })
    );
    // -- test the "x scale"
    expect(result.current.x(1)).toEqual(100);
  });
});
