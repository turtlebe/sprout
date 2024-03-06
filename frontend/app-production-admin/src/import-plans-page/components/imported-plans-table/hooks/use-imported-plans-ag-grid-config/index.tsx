import { BaseAgGridClientSideTable, StatusLabel } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { defaultAgDateColumnFilterInRange } from '@plentyag/core/src/ag-grid/custom-filters/default-date-filters';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { DateTimeFormat, getRelativeTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { getLevelFromImportedPlanStatus } from '../../utils/get-level-from-imported-plan-status';
import { UploadHistoryLineItem } from '../use-process-upload-history';

export enum Fields {
  IMPORT_STATUS = 'importStatus',
  IMPORT_DATE = 'importDate',
  WORKCENTER = 'workcenter',
  PLAN_DATE = 'planDate',
  TASKS_COUNT = 'tasksCount',
  USERNAME = 'username',
  FILENAME = 'filename',
}

export function useImportedPlansAgGridConfig(
  importedPlans: UploadHistoryLineItem[]
): BaseAgGridClientSideTable['agGridConfig'] {
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: 'Status',
        field: Fields.IMPORT_STATUS,
        colId: Fields.IMPORT_STATUS,
        minWidth: 230,
        valueGetter: row => row.data.status,
        cellRendererFramework: row => {
          const statusLevel = getLevelFromImportedPlanStatus(row.data.status);
          return (
            <Box display="flex" alignItems="center">
              <StatusLabel level={statusLevel} text={row.data.status} />
            </Box>
          );
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Import Date',
        field: Fields.IMPORT_DATE,
        colId: Fields.IMPORT_DATE,
        minWidth: 200,
        valueGetter: row =>
          row.data.uploadedAt ? DateTime.fromISO(row.data.uploadedAt).toFormat(DateTimeFormat.DATE_ONLY) : undefined,
        cellRendererFramework: row => {
          const fromNowDate = row.data.uploadedAt
            ? getRelativeTime(DateTime.fromISO(row.data.uploadedAt).toJSDate())
            : '-';
          return (
            <Box display="flex" alignItems="center">
              {fromNowDate}
            </Box>
          );
        },
        ...defaultAgDateColumnFilterInRange,
      },
      {
        headerName: 'Workcenter',
        field: Fields.WORKCENTER,
        colId: Fields.WORKCENTER,
        valueGetter: row => row.data?.workcenter || '-',
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Plan Date',
        field: Fields.PLAN_DATE,
        colId: Fields.PLAN_DATE,
        minWidth: 150,
        valueGetter: row =>
          row.data?.plannedDate ? DateTime.fromISO(row.data.plannedDate).toFormat(DateTimeFormat.DATE_ONLY) : '-',
        ...defaultAgDateColumnFilterInRange,
      },
      {
        headerName: 'Number of tasks',
        field: Fields.TASKS_COUNT,
        colId: Fields.TASKS_COUNT,
        minWidth: 50,
        valueGetter: row => row.data?.taskCount || '-',
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Username',
        field: Fields.USERNAME,
        colId: Fields.USERNAME,
        minWidth: 200,
        valueGetter: row => row.data.userName,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Filename',
        field: Fields.FILENAME,
        colId: Fields.FILENAME,
        minWidth: 200,
        valueGetter: row => row.data.fileName,
        ...defaultAgTextContainsColumnFilter,
      },
    ],
    [importedPlans]
  );

  // some columns are dynamically generated, so don't return config until crops data is available.
  if (!importedPlans) {
    return;
  }

  return {
    ...defaultConfig,
    components: {},
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
      lockPosition: true,
    },
    rowData: importedPlans,
    columnDefs,
    getRowNodeId: data => data?.id, // unique id for each row.
    immutableData: true,
  };
}
