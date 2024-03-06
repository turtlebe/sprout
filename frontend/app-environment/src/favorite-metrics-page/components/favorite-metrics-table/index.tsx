import { useGetUsersMetrics, useMetricsAgGridConfig } from '@plentyag/app-environment/src/common/hooks';
import { BaseAgGridClientSideTable, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import React from 'react';

const dataTestIds = {
  loader: 'favorite-metrics-table-loader',
};

export { dataTestIds as dataTestIdsFavoriteMetricsTable };

export interface FavoriteMetricsTable {
  onIsLoading: (isLoading) => void;
}

/**
 * AgGrid Table rendering list of Metrics.
 */
export const FavoriteMetricsTable: React.FC<FavoriteMetricsTable> = ({ onIsLoading }) => {
  const { data: usersMetrics, isValidating } = useGetUsersMetrics();
  const { config } = useMetricsAgGridConfig(usersMetrics?.data ?? []);
  const metrics = usersMetrics?.data?.map(usersMetric => usersMetric.metric).filter(metric => Boolean(metric));

  React.useEffect(() => {
    onIsLoading(isValidating);
  }, [isValidating]);

  return (
    <Show when={!isValidating} fallback={<CircularProgressCentered />}>
      <BaseAgGridClientSideTable agGridConfig={{ ...config, rowData: metrics }} />
    </Show>
  );
};
