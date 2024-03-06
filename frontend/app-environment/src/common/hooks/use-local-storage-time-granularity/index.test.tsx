import { timeGranularities } from '@plentyag/app-environment/src/common/utils/constants';
import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorageTimeGranularity } from '.';

import { clearLocalStorageTimeGranularity } from './test-helpers';

const oneMinute = timeGranularities.find(timeGranularity => timeGranularity.value === 1);
const fiveMinutes = timeGranularities.find(timeGranularity => timeGranularity.default);
const fifteenMinutes = timeGranularities.find(timeGranularity => timeGranularity.value === 15);

describe('useLocalStorageTimeGranularity', () => {
  beforeEach(() => {
    clearLocalStorageTimeGranularity();
  });

  it('returns the default time granularity when no preference has been chosen', () => {
    const { result } = renderHook(() =>
      useLocalStorageTimeGranularity({
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-02T00:00:00Z'),
      })
    );

    expect(result.current[0]).toEqual(fiveMinutes);

    act(() => result.current[1](oneMinute));

    expect(result.current[0]).toEqual(oneMinute);
  });

  it('returns the preferred time granularity when a preference has been chosen', () => {
    const hook1 = renderHook(() =>
      useLocalStorageTimeGranularity({
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-02T00:00:00Z'),
      })
    );

    expect(hook1.result.current[0]).toEqual(fiveMinutes);

    act(() => hook1.result.current[1](oneMinute));

    expect(hook1.result.current[0]).toEqual(oneMinute);

    const hook2 = renderHook(() =>
      useLocalStorageTimeGranularity({
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-02T00:00:00Z'),
      })
    );

    expect(hook2.result.current[0]).toEqual(oneMinute);
  });

  it('returns the first time granularity possible when the duration is not compatible with the default or preferred granularity', () => {
    const hook1 = renderHook(() =>
      useLocalStorageTimeGranularity({
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-04T00:00:01Z'),
      })
    );

    expect(hook1.result.current[0]).toEqual(fifteenMinutes);

    act(() => hook1.result.current[1](oneMinute));

    expect(hook1.result.current[0]).toEqual(fifteenMinutes);

    const hook2 = renderHook(() =>
      useLocalStorageTimeGranularity({
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-04T00:00:01Z'),
      })
    );

    expect(hook2.result.current[0]).toEqual(fifteenMinutes);
  });

  it('updates the time granularity to a valid one when the dates change', () => {
    const hook1 = renderHook(
      ({ startDateTime, endDateTime }) => useLocalStorageTimeGranularity({ startDateTime, endDateTime }),
      {
        initialProps: {
          startDateTime: new Date('2022-01-01T00:00:00Z'),
          endDateTime: new Date('2022-01-02T00:00:00Z'),
        },
      }
    );

    expect(hook1.result.current[0]).toEqual(fiveMinutes);

    hook1.rerender({
      startDateTime: new Date('2022-01-01T00:00:00Z'),
      endDateTime: new Date('2022-01-04T00:00:01Z'),
    });

    act(() => expect(hook1.result.current[0]).toEqual(fifteenMinutes));
  });
});
