import { ButtonFavoriteDashboard } from '@plentyag/app-environment/src/common/components';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { AppBreadcrumbs, AppHeader, Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Dashboard } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  description: 'header-dashboard-description',
  loader: 'header-dashboard-description-loader',
};

export { dataTestIds as dataTestIdsHeaderDashboard };

export interface HeaderDashboard {
  dashboard: Dashboard;
  isLoading: boolean;
}

/**
 * Header showing information about the Dashboard.
 *
 * This includes breadcrumbs, loaders, and the ability to mark the Dashboard as favorite.
 */
export const HeaderDashboard: React.FC<HeaderDashboard> = ({ dashboard, isLoading, children }) => {
  return (
    <AppHeader flexDirection="column">
      <AppBreadcrumbs
        homePageRoute={PATHS.dashboardsPage}
        homePageName="Dashboards"
        pageName={isLoading ? '--' : dashboard?.id}
        marginLeft="0.75rem"
      />

      <Box display="flex" alignItems="center">
        <ButtonFavoriteDashboard dashboard={dashboard} />
        <Show when={!isLoading} fallback={<CircularProgress size="12px" data-testid={dataTestIds.loader} />}>
          <Typography variant="h5" data-testid={dataTestIds.description}>
            {dashboard?.name}
          </Typography>
        </Show>
      </Box>

      {children}
    </AppHeader>
  );
};
