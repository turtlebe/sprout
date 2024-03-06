import { mockLanes } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';
import { renderHook } from '@testing-library/react-hooks';

import { useVerticalGrowGraphScale } from '.';

describe('useVerticalGrowGraphScale', () => {
  it('returns correct width & height, paddings, margins, ticks, and scales', () => {
    // ACT
    const { result } = renderHook(() =>
      useVerticalGrowGraphScale({
        width: 500,
        height: 200,
        lanes: mockLanes,
        towerWidth: 3,
      })
    );

    // ASSERT
    // -- correct width&height, margin, paddings, and ticks
    expect(result.current).toEqual(
      expect.objectContaining({
        width: 500,
        height: 200,
        paddingX: 16,
        paddingY: 16,
        chartMarginX: 32,
        chartMarginY: 24,
        chartWidth: 404,
        chartHeight: 120,
        ticks: 6,
      })
    );

    // -- correct towerscale for A
    expect(result.current.towersScale.A).toEqual(
      expect.objectContaining({
        laneName: 'A',
        name: 'RIGHT',
      })
    );
    expect(result.current.towersScale.A.towersScale.range()).toEqual([0, 404]);
    expect(result.current.towersScale.A.towersScale.domain()).toEqual([1, 2]);

    // -- correct towerscale for uturn
    expect(result.current.towersScale['-']).toEqual(
      expect.objectContaining({
        laneName: '-',
        name: 'RIGHT_DOWN',
      })
    );
    expect(result.current.towersScale['-'].towersScale.range()).toEqual([-1.5, 1.5]);
    expect(result.current.towersScale['-'].towersScale.domain()).toEqual([3, 3]);

    // -- correct towerscale for B
    expect(result.current.towersScale.B).toEqual(
      expect.objectContaining({
        laneName: 'B',
        name: 'LEFT',
      })
    );
    expect(result.current.towersScale.B.towersScale.range()).toEqual([404, 0]);
    expect(result.current.towersScale.B.towersScale.domain()).toEqual([4, 6]);

    // -- correct lanescale
    expect(result.current.lanesScale.domain()).toEqual([0, 2]);
    expect(result.current.lanesScale.range()).toEqual([0, 120]);
  });
});
