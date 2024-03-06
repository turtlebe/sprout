import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

import { FavoriteDashboardsTable } from './components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsFavoriteDashboardsPage };

/**
 * Page that renders all Dashboards marked as favorite.
 */
export const FavoriteDashboardsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={PATHS.dashboardsPage} homePageName="Favorite Dashboards" marginLeft="0.75rem" />
      </AppHeader>

      <FavoriteDashboardsTable onIsLoading={setIsLoading} />
    </AppLayout>
  );
};
