import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { GetApp } from '@material-ui/icons';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import {
  RefreshButton,
  dataTestids as refreshButtonDataTestIds,
} from '@plentyag/brand-ui/src/components/refresh-button';
import { Box, Button, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { KeyboardDatePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { useLoadWorkbinInstances } from '../../hooks';

import { useAgGridWorkbinTableConfig } from './hooks';
import { useStyles } from './styles';

export const dataTestIds = {
  downloadButton: 'workbin-instances-table-download-button',
  refreshButton: refreshButtonDataTestIds.button,
  dateSelectorBox: 'workbin-instances-table-date-select-box',
};

export { dataTestIds as dataTestIdsWorkspacePage };

interface WorkbinInstancesGridParams {
  roleName: string;
  refresh?: number;
}

const supervisorRole = 'Supervisor';

export const WorkbinInstancesTable: React.FC<WorkbinInstancesGridParams> = props => {
  const [coreState] = useCoreStore();
  const [selectedFilterDate, setSelectedFilterDate] = React.useState<DateTime>(DateTime.now().startOf('day'));
  const displayDate = selectedFilterDate.toFormat(DateTimeFormat.US_DATE_ONLY);
  const { loadData, clearData, unifiedWorkbinInstanceData, isLoading } = useLoadWorkbinInstances();

  function refreshDataForDate(date: DateTime) {
    clearData();
    loadData({
      farm: coreState.currentUser.currentFarmDefPath,
      createdAt: date.startOf('day').toISO(),
      createdAtBefore: date.endOf('day').toISO(),
      workbin: props.roleName,
      statuses:
        props.roleName === supervisorRole
          ? ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'FAILED']
          : ['COMPLETED', 'SKIPPED'],
    });
  }

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();
  const agGridConfig = useAgGridWorkbinTableConfig(unifiedWorkbinInstanceData);
  const classes = useStyles({ isLoading });

  function handleDateChanged(date: Date) {
    const newFilterDate = DateTime.fromJSDate(date);
    setSelectedFilterDate(newFilterDate);
    refreshDataForDate(newFilterDate);
  }

  React.useEffect(() => {
    setLastRefreshedAt(new Date().toISOString());
  }, [unifiedWorkbinInstanceData]);

  React.useEffect(() => {
    refreshDataForDate(selectedFilterDate);
  }, [props.roleName, props.refresh, coreState.currentUser.currentFarmDefPath]);

  return (
    <Box mb={4} className={classes.container}>
      <Box mx={3} my={1} display="flex" justifyContent="space-between">
        <Typography variant="h6">Workbin Instances for {displayDate}</Typography>
        <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={() => refreshDataForDate(selectedFilterDate)} />
        <KeyboardDatePicker
          data-testid={dataTestIds.dateSelectorBox}
          label="Selected date"
          showTodayButton
          value={displayDate}
          format={DateTimeFormat.US_DATE_ONLY}
          onChange={handleDateChanged}
        />
        <Button
          data-testid={dataTestIds.downloadButton}
          startIcon={<GetApp />}
          variant="contained"
          color="default"
          disabled={unifiedWorkbinInstanceData.length === 0 || isLoading}
          onClick={() =>
            handleAgGridCsvDownload({
              gridReadyEvent,
              fileNamePrefix: 'workbin-instances-' + displayDate,
            })
          }
        >
          Download
        </Button>
      </Box>
      <LinearProgress className={classes.linearProgress} />
      <BaseAgGridClientSideTable agGridConfig={agGridConfig} onGridReady={setGridReadyEvent} />
    </Box>
  );
};
