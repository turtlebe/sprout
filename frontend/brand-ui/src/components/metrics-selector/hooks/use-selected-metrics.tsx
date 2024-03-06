import { useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface UseSelectedMetrics {
  metricIds?: string[];
}

export interface UseSelectedMetricsReturn {
  metrics: Metric[];
  setMetrics: (metrics: Metric[]) => void;
  isLoading: boolean;
}

const SEARCH_METRICS = '/api/swagger/environment-service/metrics-api/search-metrics';

export const useSelectedMetrics = ({ metricIds }: UseSelectedMetrics): UseSelectedMetricsReturn => {
  const [metrics, setMetrics] = React.useState([]);
  const { data: selectedMetrics, isValidating: isLoading } = useSwrAxios<PaginatedList<Metric>>(
    metricIds &&
      metricIds.length > 0 && {
        url: SEARCH_METRICS,
        method: 'POST',
        data: { ids: metricIds },
      }
  );

  React.useEffect(() => {
    if (selectedMetrics?.data?.length > 0) {
      setMetrics(selectedMetrics.data);
    }
  }, [selectedMetrics]);

  return {
    metrics,
    setMetrics,
    isLoading,
  };
};
