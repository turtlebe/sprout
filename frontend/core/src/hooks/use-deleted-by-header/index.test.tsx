import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useDeletedByHeader } from '.';

describe('useDeletedByHeader', () => {
  it('returns the current username', () => {
    mockCurrentUser();

    const { result } = renderHook(() => useDeletedByHeader());

    expect(result.current).toEqual({ 'X-Deleted-By': 'olittle' });
  });
});
