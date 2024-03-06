import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockObservationGroups } from '@plentyag/core/src/test-helpers/mocks';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchObservationGroups } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchObservationGroups', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() => useFetchObservationGroups());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.observationGroups).toBeUndefined();
  });

  it('does not fecth data', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    renderHook(() => useFetchObservationGroups(false));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(false, expect.anything());
  });

  it('sets isLoading as false when revalidating the data', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockObservationGroups, isValidating: true });

    const { result } = renderHook(() => useFetchObservationGroups());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.observationGroups).toEqual(mockObservationGroups);
  });

  it('returns measurement-types', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockObservationGroups, isValidating: false });

    const { result } = renderHook(() => useFetchObservationGroups());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.observationGroups).toEqual(mockObservationGroups);
  });
});
