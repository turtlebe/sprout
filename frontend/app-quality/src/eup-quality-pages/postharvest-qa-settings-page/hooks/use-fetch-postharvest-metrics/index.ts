import {
  LIST_METRICS_URL,
  OBSERVATION_PATH,
} from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { toQueryParams } from '@plentyag/core/src/utils';
import { useMemo } from 'react';

export interface UseFetchMetricsReturn {
  metrics: Metric[];
  metricsRecord: Record<string, Metric>;
  revalidate: () => Promise<boolean>;
  isLoading: boolean;
}

export const useFetchPostharvestMetrics = (): UseFetchMetricsReturn => {
  const {
    data,
    revalidate,
    isValidating: isLoading,
    error,
  } = useSwrAxios<PaginatedList<Metric>>({
    url: `${LIST_METRICS_URL}${toQueryParams({
      path: OBSERVATION_PATH,
    })}`,
  });

  useLogAxiosErrorInSnackbar(error, undefined, true);

  const metrics = data?.data ?? [];

  // Create record index
  const metricsRecord = useMemo(
    () =>
      metrics.reduce((acc, metric) => {
        acc[metric.observationName] = metric;
        return acc;
      }, {}),
    [metrics]
  );

  return {
    metrics,
    metricsRecord,
    revalidate,
    isLoading,
  };
};
