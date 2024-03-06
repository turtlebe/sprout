import { GridReadyEvent, ProcessCellForExportParams } from '@ag-grid-community/all-modules';
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

import { useGetSelectedTableTaskDefinition, useLoadWorkbinTaskDefinitions } from '../../../common/hooks';
import { WorkbinTaskDefinition } from '../../../common/types/workspace';
import { EditTaskDefinitionButton } from '../edit-task-definition-button';

import { useAgGridWorkbinDefinitionTableConfig } from './hooks';
import { useStyles } from './styles';

const dataTestIds = {
  downloadButton: 'workbin-definitions-table-download-button',
  refreshButton: refreshButtonDataTestIds.button,
  editButton: 'workbin-definitions-table-edit-button',
  createButton: 'workbin-definitions-table-create-button',
};

export { dataTestIds as dataTestIdsWorkbinDefinitionsTablePage };

export const WorkbinDefinitionsTable: React.FC = () => {
  const [coreState] = useCoreStore();
  const { clearData, loadData, workbinTaskDefinitions, isLoading } = useLoadWorkbinTaskDefinitions();

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();
  const agGridConfig = useAgGridWorkbinDefinitionTableConfig(workbinTaskDefinitions);
  const classes = useStyles({ isLoading });
  const { selectedTaskDefinition, updateSelectedRow } = useGetSelectedTableTaskDefinition<WorkbinTaskDefinition>(
    gridReadyEvent,
    workbinTaskDefinitions
  );

  function refreshData() {
    clearData();
    loadData({
      farm: coreState.currentUser.currentFarmDefPath,
    });
  }

  function preprocessTableDataForDownload(params: ProcessCellForExportParams): string {
    if (params.column.getColId() === 'groups') {
      return params.value.map(value => value.displayName);
    }
    return params.value;
  }

  React.useEffect(() => {
    setLastRefreshedAt(new Date().toISOString());
  }, [workbinTaskDefinitions]);

  React.useEffect(() => {
    refreshData();
  }, [coreState.currentUser.currentFarmDefPath]);

  return (
    <AppLayout isLoading={isLoading}>
      <Box display="block">
        <Box className={classes.buttonBoxes} data-testid={dataTestIds.createButton}>
          <EditTaskDefinitionButton
            taskDefinition={selectedTaskDefinition}
            isUpdating={false}
            onEditSuccess={refreshData}
          />
        </Box>
        <Box m={0.5} className={classes.buttonBoxes} />
        <Box className={classes.buttonBoxes} data-testid={dataTestIds.editButton}>
          <EditTaskDefinitionButton taskDefinition={selectedTaskDefinition} isUpdating onEditSuccess={refreshData} />
        </Box>
        <Box m={0.5} className={classes.buttonBoxes} />
        <Box className={classes.buttonBoxes}>
          <Button
            data-testid={dataTestIds.downloadButton}
            startIcon={<GetApp />}
            variant="contained"
            color="default"
            disabled={workbinTaskDefinitions.length === 0 || isLoading}
            onClick={() =>
              handleAgGridCsvDownload({
                gridReadyEvent,
                fileNamePrefix: 'workbin-instances-' + coreState.currentUser.currentFarmDefPath,
                processCellCallback: preprocessTableDataForDownload,
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
