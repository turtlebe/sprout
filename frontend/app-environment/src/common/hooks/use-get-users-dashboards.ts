import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import useCoreStore from '@plentyag/core/src/core-store';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { UsersDashboard } from '@plentyag/core/src/types/environment';

export interface UseGetUsersDashboardsReturn extends UseSwrAxiosReturn<PaginatedList<UsersDashboard>> {}

/**
 * Fetch UsersDashboards from environment-service.
 */
export const useGetUsersDashboards = (): UseGetUsersDashboardsReturn => {
  const [coreState] = useCoreStore();

  return useSwrAxios<PaginatedList<UsersDashboard>>({
    url: EVS_URLS.usersDashboards.listUrl({
      username: coreState.currentUser.username,
      includeDashboards: true,
      limit: 1000,
    }),
  });
};
