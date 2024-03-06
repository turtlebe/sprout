import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { EVS_URLS } from '../utils';

import { useGetUsersMetrics } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

mockCurrentUser();

describe('useGetUsersMetrics', () => {
  it('queries UsersMetrics passing the current username', () => {
    renderHook(() => useGetUsersMetrics());

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: EVS_URLS.usersMetrics.listUrl({ includeMetrics: true, username: 'olittle', limit: 1000 }),
    });
  });
});
