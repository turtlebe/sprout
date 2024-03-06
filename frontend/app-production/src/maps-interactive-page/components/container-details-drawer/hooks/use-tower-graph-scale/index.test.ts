import { renderHook } from '@testing-library/react-hooks';

import { useTowerGraphScale } from '.';

describe('useTowerGraphScale', () => {
  it('returns correct width/height and scales', () => {
    // ACT
    const { result } = renderHook(() =>
      useTowerGraphScale({
        siteName: 'SSF2',
        width: 500,
        height: 200,
      })
    );

    // ASSERT
    // -- return width/height
    expect(result.current.width).toEqual(500);
    expect(result.current.height).toEqual(200);
    // -- correct scaling
    expect(result.current.yScale(1)).toEqual(20);
  });
});
