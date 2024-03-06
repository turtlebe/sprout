import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import useCoreStore from '@plentyag/core/src/core-store';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { UsersMetric } from '@plentyag/core/src/types/environment';

export interface UseGetUsersMetricsReturn extends UseSwrAxiosReturn<PaginatedList<UsersMetric>> {}

/**
 * Fetch UsersMetrics from environment-service.
 */
export const useGetUsersMetrics = (): UseGetUsersMetricsReturn => {
  const [coreState] = useCoreStore();

  return useSwrAxios<PaginatedList<UsersMetric>>({
    url: EVS_URLS.usersMetrics.listUrl({
      includeMetrics: true,
      username: coreState.currentUser.username,
      limit: 1000,
    }),
  });
};
