import { act, renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';

import { useLocalStorageQueryParams } from '.';

describe('useLocalStorageQueryParams', () => {
  it('serializes an object', () => {
    const { result, rerender } = renderHook(() => useLocalStorageQueryParams(), {
      wrapper: MemoryRouter,
    });

    expect(result.current[0]).toBeUndefined();

    act(() => result.current[1]({ foo: 'baz' }));

    rerender();

    expect(result.current[0]).toEqual({ foo: 'baz' });
  });
});
