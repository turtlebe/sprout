import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

import { ButtonCreateSchedule, ButtonDeleteSchedule, ButtonEditSchedule, SchedulesTable } from './components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsSchedulesPage };

/**
 * Page that allows CRUD operations on Schedules.
 */
export const SchedulesPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [schedulesCount, setSchedulesCount] = React.useState<number>(null);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [selectedSchedules, setSelectedSchedules] = React.useState<Schedule[]>([]);

  const handleSuccess = () => {
    gridReadyEvent.api.refreshServerSideStore({ purge: true });
    gridReadyEvent.api.deselectAll();
  };

  const handleSelectionChanged: SchedulesTable['onSelectionChanged'] = () => {
    setSelectedSchedules(gridReadyEvent.api.getSelectedRows());
  };
  const handleDatasourceSuccess: SchedulesTable['onDatasourceSuccess'] = result => {
    setSchedulesCount(result.meta.total);
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={PATHS.schedulesPage}
          homePageName={schedulesCount ? `Schedules (${schedulesCount})` : 'Schedules'}
          marginLeft="0.75rem"
        />
        <Box display="flex">
          <ButtonDeleteSchedule onSuccess={handleSuccess} schedules={selectedSchedules} />
          <Box paddingLeft="0.5rem" />
          <ButtonEditSchedule
            onSuccess={handleSuccess}
            schedule={selectedSchedules[0]}
            disabled={selectedSchedules.length !== 1}
          />
          <Box paddingLeft="0.5rem" />
          <ButtonCreateSchedule onSuccess={handleSuccess} />
        </Box>
      </AppHeader>

      <SchedulesTable
        onIsLoading={setIsLoading}
        onGridReady={setGridReadyEvent}
        onSelectionChanged={handleSelectionChanged}
        onDatasourceSuccess={handleDatasourceSuccess}
      />
    </AppLayout>
  );
};
