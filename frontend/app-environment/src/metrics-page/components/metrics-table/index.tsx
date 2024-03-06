import { useGetUsersMetrics, useMetricsAgGridConfig } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { BaseAgGridInfiniteTable, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { useExtendedAgGridWithExpandableRows } from '@plentyag/core/src/hooks';
import React from 'react';

import { MetricExpandedRow } from '../metric-expanded-row';

const dataTestIds = {
  loader: 'metrics-table-loader',
};

export { dataTestIds as dataTestIdsMetricsTable };

export interface MetricsTable {
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onGridReady: BaseAgGridInfiniteTable['onGridReady'];
  onSelectionChanged: BaseAgGridInfiniteTable['onSelectionChanged'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
}

/**
 * AgGrid Table rendering infinite list of Metrics.
 */
export const MetricsTable: React.FC<MetricsTable> = ({
  onIsLoading,
  onGridReady,
  onSelectionChanged,
  onDatasourceSuccess,
}) => {
  const getUsersMetrics = useGetUsersMetrics();
  const { data: usersMetrics } = getUsersMetrics;

  const metricsAgGridConfig = useMetricsAgGridConfig(usersMetrics?.data ?? []);
  const config = useExtendedAgGridWithExpandableRows({
    agGridConfig: metricsAgGridConfig.config,
    expandedRowHeight: 200,
    renderExpandableRow: row => <MetricExpandedRow metric={row.data} />,
  });

  const isValidating = getUsersMetrics.isValidating || metricsAgGridConfig.isValidating;

  return (
    <Show when={!isValidating} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
      <BaseAgGridInfiniteTable
        agGridConfig={config}
        onIsLoading={onIsLoading}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        onDatasourceSuccess={onDatasourceSuccess}
        url={EVS_URLS.metrics.searchUrl()}
        requestMethod="POST"
        extraData={{ includeAlertRules: true, includeSubscriptions: true }}
      />
    </Show>
  );
};
