import { mockTagProviders } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchTagProviders } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchTagProviders', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() => useFetchTagProviders());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.tagProviders).toBeUndefined();
  });

  it('sets isLoading as false when revalidating the data', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockTagProviders, isValidating: true });

    const { result } = renderHook(() => useFetchTagProviders());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tagProviders).toEqual(mockTagProviders);
  });

  it('returns tag-providers', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockTagProviders, isValidating: false });

    const { result } = renderHook(() => useFetchTagProviders());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tagProviders).toEqual(mockTagProviders);
  });
});
