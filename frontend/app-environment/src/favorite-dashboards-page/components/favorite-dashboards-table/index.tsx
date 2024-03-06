import { useDashboardsAgGridConfig, useGetUsersDashboards } from '@plentyag/app-environment/src/common/hooks';
import { BaseAgGridClientSideTable, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import React from 'react';

const dataTestIds = {
  loader: 'favorite-dashboards-table-loader',
};

export { dataTestIds as dataTestIdsFavoriteDashboardsTable };

export interface FavoriteDashboardsTable {
  onIsLoading: (isLoading) => void;
}

export const FavoriteDashboardsTable: React.FC<FavoriteDashboardsTable> = ({ onIsLoading }) => {
  const { data: usersDashboards, isValidating } = useGetUsersDashboards();
  const { config } = useDashboardsAgGridConfig(usersDashboards?.data ?? []);
  const dashboards = usersDashboards?.data
    ?.map(usersDashboard => usersDashboard.dashboard)
    .filter(dashboard => Boolean(dashboard));

  React.useEffect(() => {
    onIsLoading(isValidating);
  }, [isValidating]);

  return (
    <Show when={!isValidating} fallback={<CircularProgressCentered />}>
      <BaseAgGridClientSideTable agGridConfig={{ ...config, rowData: dashboards }} />
    </Show>
  );
};
