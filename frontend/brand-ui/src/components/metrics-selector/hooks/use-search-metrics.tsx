import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';

export interface UseSearchMetrics {
  path?: string;
  ids?: string[];
}

export interface UseSearchMetricsReturn extends UseSwrAxiosReturn<PaginatedList<Metric>> {}

const SEARCH_METRICS = '/api/swagger/environment-service/metrics-api/search-metrics';

export const useSearchMetrics = ({ path: pathContains, ids }: UseSearchMetrics): UseSearchMetricsReturn => {
  return useSwrAxios<PaginatedList<Metric>>({
    url: SEARCH_METRICS,
    method: 'POST',
    data: { pathContains, ids },
  });
};
