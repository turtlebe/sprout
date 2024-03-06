import { User } from '@plentyag/core/src/core-store/types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { renderHook } from '@testing-library/react-hooks';

import { useGetUser } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useGetUser', () => {
  it('returns undefined', () => {
    mockUseSwrAxios.mockReturnValue({});

    const { result } = renderHook(() => useGetUser({ username: 'mock-username ' }));

    expect(result.current).toEqual({});
  });

  it('returns a user', () => {
    const user: User = { firstName: 'Omar', lastName: 'little', username: 'olittle' };
    mockUseSwrAxios.mockReturnValue({ data: user });

    const { result } = renderHook(() => useGetUser({ username: 'mock-username ' }));

    expect(result.current.data).toEqual(user);
  });
});
