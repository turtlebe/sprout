import { Timeline } from '@material-ui/icons';
import { AlertEventsTable } from '@plentyag/app-environment/src/common/components';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

/**
 * Page displayings all the Active AlertEvents in the system via in AgGrid infinite table.
 */
export const AlertEventsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [alertEventsCount, setAlertEventsCount] = React.useState<number>(null);

  const handleDatasourceSuccess: AlertEventsTable['onDatasourceSuccess'] = result => {
    setAlertEventsCount(result.meta.total);
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={PATHS.alertEventsPage}
          homePageName={alertEventsCount ? `Active Alerts (${alertEventsCount})` : 'Active Alerts'}
          marginLeft="0.75rem"
        />
        <Box display="flex" alignItems="center">
          <Link to={PATHS.alertEventsHistoricalPage} style={{ textDecoration: 'none' }}>
            <Button color="secondary" variant="contained" startIcon={<Timeline />}>
              All Alerts
            </Button>
          </Link>
        </Box>
      </AppHeader>

      <AlertEventsTable onIsLoading={setIsLoading} onDatasourceSuccess={handleDatasourceSuccess} activeOnly />
    </AppLayout>
  );
};
