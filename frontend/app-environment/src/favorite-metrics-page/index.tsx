import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

import { FavoriteMetricsTable } from './components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsFavoriteMetricsPage };

/**
 * Page that renders all Metrics marked as favorite.
 */
export const FavoriteMetricsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={PATHS.metricsPage} homePageName="Favorite Metrics" marginLeft="0.75rem" />
      </AppHeader>

      <FavoriteMetricsTable onIsLoading={setIsLoading} />
    </AppLayout>
  );
};
