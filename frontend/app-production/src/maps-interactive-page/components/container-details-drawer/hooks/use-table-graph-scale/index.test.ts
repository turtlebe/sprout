import { renderHook } from '@testing-library/react-hooks';

import { useTableGraphScale } from '.';

describe('useTableGraphScale', () => {
  it('returns correct width & height, paddings, and scales (landscape ratio)', () => {
    // ACT
    const { result } = renderHook(() =>
      useTableGraphScale({
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
    expect(result.current.yScale(1)).toEqual(22.666666666666664);
    expect(result.current.xScale(1)).toEqual(14.166666666666666);
  });

  it('returns correct width & height, paddings, and scales (portrait ratio)', () => {
    // ACT
    const { result } = renderHook(() =>
      useTableGraphScale({
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
    expect(result.current.yScale(1)).toEqual(36.266666666666666);
    expect(result.current.xScale(1)).toEqual(22.666666666666664);
  });
});
