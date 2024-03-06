import { useFetchObservationGroups } from '@plentyag/core/src/hooks';
import { mockObservationGroups } from '@plentyag/core/src/test-helpers/mocks';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '../use-autocomplete-farm-def-object-store';

import { useLoadObservationGroups } from '.';

jest.mock('@plentyag/core/src/hooks/use-fetch-observation-groups');

const id = 'id';

const mockUseFetchObservationGroups = useFetchObservationGroups as jest.Mock;

describe('useLoadObservationGroups', () => {
  beforeEach(() => {
    mockUseFetchObservationGroups.mockRestore();

    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].resetStore());
  });

  it('does not load observation groups into the store', () => {
    mockUseFetchObservationGroups.mockReturnValue({ observationGroups: undefined, isLoading: false });

    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    renderHook(() => useLoadObservationGroups(id, false));

    expect(result.current[0].treeObservationGroups).toEqual({ count: 0, children: {} });

    expect(mockUseFetchObservationGroups).toHaveBeenCalledWith(false);
  });

  it('loads observation groups into the store', () => {
    mockUseFetchObservationGroups.mockReturnValue({ observationGroups: mockObservationGroups, isLoading: false });

    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    renderHook(() => useLoadObservationGroups(id, true));

    expect(result.current[0].treeObservationGroups).toEqual({
      count: 0,
      children: expect.objectContaining({ 'sites/SSF2': expect.anything() }),
    });

    expect(mockUseFetchObservationGroups).toHaveBeenCalledWith(true);
  });
});
