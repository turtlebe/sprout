import { DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorageTimeSummarization } from '.';

import { clearLocalStorageTimeSummarization } from './test-helpers';

describe('useLocalStorageTimeSummarization', () => {
  beforeEach(() => {
    clearLocalStorageTimeSummarization();
  });

  it('returns the default time summarization when no preference has been chosen', () => {
    const { result } = renderHook(() => useLocalStorageTimeSummarization());

    expect(result.current[0]).toBe(DEFAULT_TIME_SUMMARIZATION);

    act(() => result.current[1](TimeSummarization.mean));

    expect(result.current[0]).toBe(TimeSummarization.mean);
  });

  it('returns the preferred time summarization when a preference has been chosen', () => {
    const hook1 = renderHook(() => useLocalStorageTimeSummarization());

    expect(hook1.result.current[0]).toBe(DEFAULT_TIME_SUMMARIZATION);

    act(() => hook1.result.current[1](TimeSummarization.max));

    expect(hook1.result.current[0]).toBe(TimeSummarization.max);

    const hook2 = renderHook(() => useLocalStorageTimeSummarization());

    expect(hook2.result.current[0]).toBe(TimeSummarization.max);
  });
});
