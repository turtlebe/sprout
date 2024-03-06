import { renderHook } from '@testing-library/react-hooks';

import { useTrayGraphScale } from '.';

describe('useTrayGraphScale', () => {
  it('returns correct width & height, paddings, and scales (landscape ratio)', () => {
    // ACT
    const { result } = renderHook(() =>
      useTrayGraphScale({
        siteName: 'SSF2',
        width: 500,
        height: 200,
      })
    );

    // ASSERT
    // -- return width/height and paddings
    expect(result.current.width).toEqual(500);
    expect(result.current.height).toEqual(200);
    expect(result.current.paddingX).toEqual(32);
    expect(result.current.paddingY).toEqual(32);
    // -- correct scaling
    expect(result.current.yScale(1)).toEqual(8.5);
    expect(result.current.xScale(1)).toEqual(8.5);
  });

  it('returns correct width & height, paddings, and scales (portrait ratio)', () => {
    // ACT
    const { result } = renderHook(() =>
      useTrayGraphScale({
        siteName: 'SSF2',
        width: 200,
        height: 500,
      })
    );

    // ASSERT
    // -- return width/height and paddings
    expect(result.current.width).toEqual(200);
    expect(result.current.height).toEqual(500);
    expect(result.current.paddingX).toEqual(32);
    expect(result.current.paddingY).toEqual(32);
    // -- correct scaling
    expect(result.current.yScale(1)).toEqual(13.6);
    expect(result.current.xScale(1)).toEqual(13.600000000000001);
  });
});
