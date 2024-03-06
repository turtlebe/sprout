import { mockTagPaths } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchTagPaths } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchTagPaths', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() => useFetchTagPaths('dummy-provider'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.tagPaths).toBeUndefined();
  });

  it('sets isLoading as false when revalidating the data', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockTagPaths, isValidating: true });

    const { result } = renderHook(() => useFetchTagPaths('dummy-provider'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tagPaths).toEqual(mockTagPaths);
  });

  it('returns tag-paths', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockTagPaths, isValidating: false });

    const { result } = renderHook(() => useFetchTagPaths('dummy-provider'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tagPaths).toEqual(mockTagPaths);
  });
});
