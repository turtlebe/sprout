import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { useMeasure } from '.';

describe('useMeasure', () => {
  it('returns correct size at start and after resize event', () => {
    // ARRANGE 1
    const mockRef = {
      current: {
        clientWidth: 100,
        clientHeight: 100,
      },
    };

    // ACT 1
    const { result } = renderHook(() => useMeasure(mockRef as React.RefObject<HTMLDivElement>));

    // ASSERT 1
    expect(result.current).toEqual({ width: 100, height: 100 });

    act(() => {
      // ARRANGE 2
      mockRef.current = {
        ...mockRef.current,
        clientWidth: 200,
        clientHeight: 300,
      };

      // ACT 2
      window.dispatchEvent(new Event('resize'));
    });

    // ASSERT 2
    expect(result.current).toEqual({ width: 200, height: 300 });
  });
});
