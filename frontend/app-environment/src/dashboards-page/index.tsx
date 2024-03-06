import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { Dashboard } from '@plentyag/core/src/types/environment';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { PATHS } from '../paths';

import { ButtonCreateDashboard, ButtonDeleteDashboard, ButtonEditDashboard, DashboardsTable } from './components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsDashboardsPage };

/**
 * Page that displays a List of Dashboards with CTAs to CRUD Dashboards.
 */
export const DashboardsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [dashboardsCount, setDashboardsCount] = React.useState<number>(null);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [selectedDashboards, setSelectedDashboards] = React.useState<Dashboard[]>([]);

  const handleSuccess = () => {
    gridReadyEvent.api.refreshServerSideStore({ purge: true });
    gridReadyEvent.api.deselectAll();
  };
  const handleSelectionChanged: DashboardsTable['onSelectionChanged'] = () => {
    setSelectedDashboards(gridReadyEvent.api.getSelectedRows());
  };
  const handleDatasourceSuccess: DashboardsTable['onDatasourceSuccess'] = result => {
    setDashboardsCount(result.meta.total);
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={PATHS.dashboardsPage}
          homePageName={dashboardsCount ? `Dashboards (${dashboardsCount})` : 'Dashboards'}
          marginLeft="0.75rem"
        />
        <Box display="flex">
          <ButtonDeleteDashboard onSuccess={handleSuccess} dashboards={selectedDashboards} />
          <Box paddingLeft="0.5rem" />
          <ButtonEditDashboard
            onSuccess={handleSuccess}
            dashboard={selectedDashboards[0]}
            disabled={selectedDashboards.length !== 1}
          />
          <Box paddingLeft="0.5rem" />
          <ButtonCreateDashboard onSuccess={handleSuccess} />
        </Box>
      </AppHeader>

      <DashboardsTable
        onIsLoading={setIsLoading}
        onGridReady={setGridReadyEvent}
        onSelectionChanged={handleSelectionChanged}
        onDatasourceSuccess={handleDatasourceSuccess}
      />
    </AppLayout>
  );
};
