import { usePutRequest } from '@plentyag/core/src/hooks/use-axios';

interface UpdateCacheResponse {
  lastRefreshedAt: string;
}

export const useUpdateCache = (dashboardName: string) => {
  return usePutRequest<UpdateCacheResponse, any>({ url: `/api/sisense/dashboards/${dashboardName}/cache` });
};
