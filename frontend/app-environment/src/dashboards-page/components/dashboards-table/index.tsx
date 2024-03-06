import { useDashboardsAgGridConfig, useGetUsersDashboards } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { BaseAgGridInfiniteTable, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import React from 'react';

const dataTestIds = {
  loader: 'dashboards-table-loader',
};

export { dataTestIds as dataTestIdsDashboardsTable };

export interface DashboardsTable {
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onGridReady: BaseAgGridInfiniteTable['onGridReady'];
  onSelectionChanged: BaseAgGridInfiniteTable['onSelectionChanged'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
}

/**
 * AgGrid Table rendering infinite list of Dashboards.
 */
export const DashboardsTable: React.FC<DashboardsTable> = ({
  onIsLoading,
  onGridReady,
  onSelectionChanged,
  onDatasourceSuccess,
}) => {
  const { data: usersDashboards, isValidating } = useGetUsersDashboards();

  const { config } = useDashboardsAgGridConfig(usersDashboards?.data ?? []);

  return (
    <Show when={!isValidating} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
      <BaseAgGridInfiniteTable
        agGridConfig={config}
        onIsLoading={onIsLoading}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        onDatasourceSuccess={onDatasourceSuccess}
        url={EVS_URLS.dashboards.searchUrl()}
        requestMethod="POST"
        extraData={{ includeMetrics: true }}
      />
    </Show>
  );
};
