import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { LiveTv } from '@material-ui/icons';
import { AlertEventsTable } from '@plentyag/app-environment/src/common/components';
import { useWindowDateTime } from '@plentyag/app-environment/src/common/hooks';
import {
  AppBreadcrumbs,
  AppHeader,
  AppLayout,
  dataTestIdsWindowDateTimePicker,
  WindowDateTimePicker,
} from '@plentyag/brand-ui/src/components';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

const dataTestIds = {
  windowDateTimePicker: dataTestIdsWindowDateTimePicker,
};

export { dataTestIds as dataTestIdsAlertEventsHistoricalPage };

/**
 * Page displayings all the AlertEvents in the system via in AgGrid infinite table.
 */
export const AlertEventsHistoricalPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [alertEventsCount, setAlertEventsCount] = React.useState<number>(null);
  const { startDateTime, endDateTime, setStartDateTime, setEndDateTime } = useWindowDateTime();
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);

  const handleDatasourceSuccess: AlertEventsTable['onDatasourceSuccess'] = result => {
    setAlertEventsCount(result.meta.total);
  };

  const handleWindowChanged: WindowDateTimePicker['onChange'] = (startDateTime, endDateTime) => {
    setStartDateTime(startDateTime);
    setEndDateTime(endDateTime);
  };

  React.useEffect(() => {
    if (gridReadyEvent?.api) {
      gridReadyEvent.api.refreshServerSideStore({ purge: true });
    }
  }, [startDateTime, endDateTime]);

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <Box flexGrow={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between
        "
          >
            <AppBreadcrumbs
              homePageRoute={PATHS.alertEventsHistoricalPage}
              homePageName={alertEventsCount ? `All Alerts (${alertEventsCount})` : 'All Alerts'}
              marginLeft="0.75rem"
            />
            <Link to={PATHS.alertEventsPage} style={{ textDecoration: 'none' }}>
              <Button color="secondary" variant="contained" startIcon={<LiveTv />}>
                Active Alerts
              </Button>
            </Link>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <WindowDateTimePicker
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onChange={handleWindowChanged}
            />
          </Box>
        </Box>
      </AppHeader>

      <AlertEventsTable
        onIsLoading={setIsLoading}
        onDatasourceSuccess={handleDatasourceSuccess}
        onGridReady={setGridReadyEvent}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
      />
    </AppLayout>
  );
};
