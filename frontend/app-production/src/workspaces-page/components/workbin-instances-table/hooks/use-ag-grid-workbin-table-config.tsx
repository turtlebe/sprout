import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { UnifiedWorkbinInstanceData } from '@plentyag/app-production/src/common/types';
import {
  AgGridDialogRenderer,
  AgGridListCountDialogDetailsRenderer,
  AgGridListRenderer,
  BaseAgGridClientSideTable,
} from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import {
  defaultAgTextContainsColumnFilter,
  defaultAgTextContainsOrBlankFilter,
} from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { truncate } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';

export const fields = {
  shortTitle: 'shortTitle',
  farm: 'farm',
  title: 'title',
  description: 'description',
  sopLink: 'sopLink',
  priority: 'priority',
  workbin: 'workbin',
  completer: 'completer',
  status: 'status',
  values: 'values',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  comments: 'comments',
  changelogs: 'changelogs',
};

export function useAgGridWorkbinTableConfig(
  unifiedWorkbinInstanceData: UnifiedWorkbinInstanceData[]
): BaseAgGridClientSideTable['agGridConfig'] {
  const agGridConfig: BaseAgGridClientSideTable['agGridConfig'] = React.useMemo(
    () => ({
      components: {},
      defaultColDef: {
        floatingFilter: true,
        sortable: true,
        resizable: true,
        lockPosition: true,
      },
      columnDefs: [
        {
          headerName: 'Short Title',
          sortable: false,
          field: fields.shortTitle,
          colId: fields.shortTitle,
          valueGetter: params => params?.data?.workbinTaskDefinition?.shortTitle,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Title',
          sortable: false,
          field: fields.title,
          colId: fields.title,
          valueGetter: params => params?.data?.workbinTaskDefinition?.title,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Description',
          sortable: false,
          field: fields.description,
          colId: fields.description,
          maxWidth: 150,
          cellRendererFramework: params => (
            <AgGridDialogRenderer
              cellText={truncate(params?.data?.workbinTaskDefinition?.description, { length: 10 })}
              title={'Full description of task: ' + params?.data?.workbinTaskDefinition?.title}
              content={<Typography>{params?.data?.workbinTaskDefinition?.description}</Typography>}
            />
          ),
          valueGetter: params => params?.data?.workbinTaskDefinition?.description,
        },
        {
          headerName: 'Completer',
          sortable: false,
          field: fields.completer,
          colId: fields.completer,
          valueGetter: params => params?.data?.workbinTaskInstance?.completer,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Status',
          sortable: false,
          field: fields.status,
          colId: fields.status,
          valueGetter: params => params?.data?.workbinTaskInstance?.status,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Values',
          sortable: false,
          field: fields.values,
          colId: fields.values,
          maxWidth: 150,
          cellRendererFramework: params => (
            <AgGridListRenderer
              list={Object.entries(params?.data?.workbinTaskInstance?.values).map(v => `${v[0]}=${v[1]}`)}
            />
          ),
          valueGetter: params => JSON.stringify(params?.data?.workbinTaskInstance?.values),
        },
        {
          headerName: 'Priority',
          sortable: false,
          field: fields.priority,
          colId: fields.priority,
          valueGetter: params => params?.data?.workbinTaskDefinition?.priority,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Workbin',
          sortable: false,
          field: fields.workbin,
          colId: fields.workbin,
          valueGetter: params => params?.data?.workbinTaskInstance?.workbin,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Notes',
          sortable: false,
          field: fields.comments,
          colId: fields.comments,
          valueGetter: params => JSON.stringify(params?.data?.workbinTaskComments),
          ...defaultAgTextContainsOrBlankFilter,
          cellRendererFramework: params => (
            <AgGridListCountDialogDetailsRenderer
              list={params?.data?.workbinTaskComments}
              title={`Comments for ${params?.data?.workbinTaskInstance?.id}`}
            />
          ),
        },
        {
          headerName: 'Changes',
          sortable: false,
          field: fields.changelogs,
          colId: fields.changelogs,
          valueGetter: params => JSON.stringify(params?.data?.workbinTaskChangeLogs),
          ...defaultAgTextContainsOrBlankFilter,
          cellRendererFramework: params => (
            <AgGridListCountDialogDetailsRenderer
              list={params?.data?.workbinTaskChangeLogs}
              title={`Changelogs for ${params?.data?.workbinTaskInstance?.id}`}
            />
          ),
        },
        {
          headerName: 'Created at',
          sortable: true,
          field: fields.createdAt,
          colId: fields.createdAt,
          valueGetter: params =>
            DateTime.fromISO(params?.data?.workbinTaskInstance?.createdAt).toFormat(
              DateTimeFormat.SQL_TIME_WITH_SECONDS
            ),
        },
        {
          headerName: 'Updated at',
          sortable: true,
          field: fields.updatedAt,
          colId: fields.updatedAt,
          valueGetter: params =>
            DateTime.fromISO(params?.data?.workbinTaskInstance?.updatedAt).toFormat(
              DateTimeFormat.SQL_TIME_WITH_SECONDS
            ),
        },
      ],
      modules: AllCommunityModules,
      rowHeight: 48,
      suppressColumnVirtualisation: true,
      suppressRowClickSelection: true,
      rowSelection: 'multiple',
      rowData: unifiedWorkbinInstanceData,
      getRowNodeId: data => data?.workbinTaskInstance?.id,
      immutableData: true,
    }),
    [unifiedWorkbinInstanceData]
  );

  return agGridConfig;
}
