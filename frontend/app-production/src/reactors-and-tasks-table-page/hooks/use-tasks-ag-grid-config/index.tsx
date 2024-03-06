import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { DurativeTaskState } from '@plentyag/app-production/src/common/types';
import { getLevelFromTaskStatus, getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { PlentyLink, StatusLabel } from '@plentyag/brand-ui/src/components';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { Box, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';

import { dataTestIdsReactorsAndTasksTablePage as dataTestIds } from '../../index';

export enum Fields {
  TASK_STATUS = 'taskStatus',
  TASK_TYPE = 'type',
  TASK_ID = 'id',
  CREATED_AT = 'createdAt',
  DISPLAY_TITLE = 'displayTitle',
  REACTOR_PATH = 'reactorPath',
}

export const useTasksAgGridConfig = (tasks: DurativeTaskState[]): BaseAgGridClientSideTable['agGridConfig'] => {
  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  const agGridConfig: BaseAgGridClientSideTable['agGridConfig'] = {
    components: {},
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    columnDefs: [
      {
        headerName: 'Status',
        field: Fields.TASK_STATUS,
        colId: Fields.TASK_STATUS,
        minWidth: 112,
        valueGetter: row => row.data.taskStatus,
        cellRendererFramework: row => {
          const statusLevel = getLevelFromTaskStatus(row.data.taskStatus);
          return (
            <Box display="flex" alignItems="center">
              <StatusLabel level={statusLevel} text={row.data.taskStatus} />
            </Box>
          );
        },
      },
      {
        headerName: 'Date',
        field: Fields.CREATED_AT,
        colId: Fields.CREATED_AT,
        valueGetter: row => {
          return getLuxonDateTime(row.data.createdAt).toFormat(DateTimeFormat.US_DATE_ONLY);
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Title',
        field: Fields.DISPLAY_TITLE,
        colId: Fields.DISPLAY_TITLE,
        minWidth: 450,
        valueGetter: row => row.data.taskInstance.displayTitle,
        cellRendererFramework: row => {
          const path = row.data.executingReactorPath;
          const id = row.data.taskInstance.id;
          const displayTitle = row.data.taskInstance.displayTitle;
          const url = getReactorsAndTasksDetailPath({ reactorsAndTasksDetailBasePath, reactorPath: path, taskId: id });
          return (
            <Box display="flex" alignItems="center">
              <PlentyLink to={url} openInNewTab data-testid={dataTestIds.taskLink(id)}>
                <Tooltip title={displayTitle}>
                  <Box>{displayTitle}</Box>
                </Tooltip>
              </PlentyLink>
            </Box>
          );
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Type',
        field: Fields.TASK_TYPE,
        colId: Fields.TASK_TYPE,
        valueGetter: row => row.data.taskInstance.type,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Reactor',
        field: Fields.REACTOR_PATH,
        colId: Fields.REACTOR_PATH,
        minWidth: 450,
        valueGetter: row => row.data.executingReactorPath,
        cellRendererFramework: row => {
          const path = row.data.executingReactorPath;
          const id = row.data.taskInstance.id;
          const url = getReactorsAndTasksDetailPath({ reactorsAndTasksDetailBasePath, reactorPath: path });
          return (
            <Box display="flex" alignItems="center">
              <PlentyLink to={url} openInNewTab data-testid={dataTestIds.reactorLink(id)}>
                <Tooltip title={path}>
                  <Box>{path}</Box>
                </Tooltip>
              </PlentyLink>
            </Box>
          );
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'ID',
        field: Fields.TASK_ID,
        colId: Fields.TASK_ID,
        minWidth: 115,
        valueGetter: row => row.data.taskInstance.id,
        ...defaultAgTextContainsColumnFilter,
      },
    ],
    modules: AllCommunityModules,
    rowHeight: 48,
    suppressColumnVirtualisation: true,
    suppressRowClickSelection: true,
    rowData: tasks,
    getRowNodeId: data => data?.taskId, // unique id for each row.
    immutableData: true,
  };

  return agGridConfig;
};
