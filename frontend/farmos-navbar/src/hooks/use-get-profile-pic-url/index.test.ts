import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { DEFAULT_PIC, useGetProfilePicUrl } from '.';

describe('useGetProfilePicUrl', () => {
  it('gets the profile pic on mount', async () => {
    const mockFetch = jest.spyOn(window, 'fetch');
    const mockUrl = 'https://lh3.googleusercontent.com/a/ALm5wu2mtghUbHaGDCSTf6zlrBeWYtjKhxIZFS5fZmOC=s96-c';
    // @ts-ignore - fetch result (Response) has many other fields but only need json data here.
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        picture: mockUrl,
      }),
    });
    const { result, rerender } = renderHook(() => useGetProfilePicUrl());

    // initially loading with no pic
    expect(result.current.isLoading).toBe(true);
    expect(result.current.profilePicUrl).toBe(undefined);

    await actAndAwaitForHook(() => result.current);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profilePicUrl).toBe(mockUrl);

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // rerender should not fetch again, since we already fetched.
    await actAndAwaitForHook(() => rerender());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profilePicUrl).toBe(mockUrl);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('returns default when fetch fails', async () => {
    const mockFetch = jest.spyOn(window, 'fetch');
    mockFetch.mockRejectedValue({});

    const { result } = renderHook(() => useGetProfilePicUrl());

    await actAndAwaitForHook(() => result.current);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profilePicUrl).toBe(DEFAULT_PIC);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
