import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { GetApp } from '@material-ui/icons';
import { AppLayout, BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import {
  RefreshButton,
  dataTestids as refreshButtonDataTestIds,
} from '@plentyag/brand-ui/src/components/refresh-button';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { useCoreStore } from '@plentyag/core/src/core-store';
import React from 'react';

import {
  useGetSelectedTableWorkbinTrigger,
  useLoadWorkbinTaskDefinitions,
  useLoadWorkbinTriggers,
} from '../../../common/hooks';
import { WorkbinTaskTrigger } from '../../../common/types/workspace';
import { EditWorkbinTriggerButton } from '../edit-workbin-trigger-button';

import { useAgGridWorkbinTriggersTableConfig } from './hooks';
import { useStyles } from './styles';

const dataTestIds = {
  downloadButton: 'workbin-triggers-table-download-button',
  refreshButton: refreshButtonDataTestIds.button,
  editButton: 'workbin-triggers-table-edit-button',
  createButton: 'workbin-triggers-table-create-button',
};

export { dataTestIds as dataTestIdsWorkbinTriggersTablePage };

export const WorkbinTriggersTable: React.FC = () => {
  const [coreState] = useCoreStore();
  const { clearData, loadData, workbinTaskTriggers, isLoading: isLoadingTriggers } = useLoadWorkbinTriggers();
  const {
    clearData: clearDefinitionsData,
    loadData: loadDefinitionsData,
    isLoading: isLoadingTaskDefinitions,
  } = useLoadWorkbinTaskDefinitions();

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();
  const agGridConfig = useAgGridWorkbinTriggersTableConfig(workbinTaskTriggers);
  const classes = useStyles({ isLoading: isLoadingTriggers || isLoadingTaskDefinitions });
  const { selectedWorkbinTrigger, updateSelectedRow } = useGetSelectedTableWorkbinTrigger<WorkbinTaskTrigger>(
    gridReadyEvent,
    workbinTaskTriggers
  );

  function refreshData() {
    clearData();
    clearDefinitionsData();
    loadData({
      farm: coreState.currentUser.currentFarmDefPath,
    });
    loadDefinitionsData({
      farm: coreState.currentUser.currentFarmDefPath,
      definitionCreatedByInternalService: false,
    });
  }

  React.useEffect(() => {
    setLastRefreshedAt(new Date().toISOString());
  }, [workbinTaskTriggers]);

  React.useEffect(() => {
    refreshData();
  }, [coreState.currentUser.currentFarmDefPath]);
  return (
    <AppLayout isLoading={isLoadingTriggers || isLoadingTaskDefinitions}>
      <Box display="block">
        <Box className={classes.buttonBoxes} data-testid={dataTestIds.editButton}>
          <EditWorkbinTriggerButton workbinTrigger={selectedWorkbinTrigger} isUpdating onEditSuccess={refreshData} />
        </Box>
        <Box m={0.5} className={classes.buttonBoxes} />
        <Box className={classes.buttonBoxes}>
          <Button
            data-testid={dataTestIds.downloadButton}
            startIcon={<GetApp />}
            variant="contained"
            color="default"
            disabled={workbinTaskTriggers.length === 0 || isLoadingTriggers || isLoadingTaskDefinitions}
            onClick={() =>
              handleAgGridCsvDownload({
                gridReadyEvent,
                fileNamePrefix: 'workbin-triggers-' + coreState.currentUser.currentFarmDefPath,
              })
            }
          >
            Download
          </Button>
        </Box>

        <Box mx={3} my={1} display="flex" justifyContent="space-between">
          <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={() => refreshData()} />
        </Box>
      </Box>

      <Box width={1} height={0.9}>
        <BaseAgGridClientSideTable
          agGridConfig={agGridConfig}
          onGridReady={setGridReadyEvent}
          onSelectionChanged={updateSelectedRow}
        />
      </Box>
    </AppLayout>
  );
};
