import { LiveStatus } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';

import { useGetLiveStatusColor } from './use-get-live-status-color';

describe('useGetLiveStatusColor', () => {
  it('returns green', () => {
    const { result } = renderHook(() => useGetLiveStatusColor(LiveStatus.inRange));

    expect(result.current).toBe('#4caf50');
  });

  it('returns red', () => {
    const { result } = renderHook(() => useGetLiveStatusColor(LiveStatus.outOfRange));

    expect(result.current).toBe('#f44336');
  });

  it('returns grey', () => {
    const { result } = renderHook(() => useGetLiveStatusColor(LiveStatus.noData));

    expect(result.current).toBe('#9e9e9e');
  });
});
