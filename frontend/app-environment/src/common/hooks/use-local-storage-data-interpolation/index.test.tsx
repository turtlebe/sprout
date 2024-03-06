import { dataInterpolations } from '@plentyag/app-environment/src/common/utils/constants';
import { DataInterpolationType } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorageDataInterpolation } from '.';

import { clearLocalStorageTimeGranularity } from './test-helpers';

const defaultOne = dataInterpolations.find(
  dataInterpolation => dataInterpolation.value === DataInterpolationType.default
);
const step = dataInterpolations.find(dataInterpolation => dataInterpolation.value === DataInterpolationType.step);

describe('useLocalStorageDataInterpolation', () => {
  const id = 'id';
  beforeEach(() => {
    clearLocalStorageTimeGranularity(id);
  });

  it('returns the default data interpolation when no preference has been chosen', () => {
    const { result } = renderHook(() => useLocalStorageDataInterpolation({ id }));

    expect(result.current[0]).toEqual(defaultOne);

    act(() => result.current[1](step));

    expect(result.current[0]).toEqual(step);
  });

  it('returns the preferred data interpolation when a preference has been chosen', () => {
    const hook1 = renderHook(() => useLocalStorageDataInterpolation({ id }));

    expect(hook1.result.current[0]).toEqual(defaultOne);

    act(() => hook1.result.current[1](step));

    expect(hook1.result.current[0]).toEqual(step);

    const hook2 = renderHook(() => useLocalStorageDataInterpolation({ id }));

    expect(hook2.result.current[0]).toEqual(step);
  });
});
