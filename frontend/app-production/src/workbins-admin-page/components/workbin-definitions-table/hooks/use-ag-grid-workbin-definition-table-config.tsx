import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { WorkbinTaskDefinition } from '@plentyag/app-production/src/common/types/workspace';
import { getFarmNameFromFarmPath } from '@plentyag/app-production/src/common/utils';
import { AgGridDialogRenderer, AgGridListRenderer, BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultAgDateColumnFilterInRange } from '@plentyag/core/src/ag-grid/custom-filters/default-date-filters';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { SelectableItem, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

// TODO: Once WBS supports / returns updatedBy / createdBy these will also be added
export const fields = {
  title: 'title',
  shortTitle: 'shortTitle',
  farm: 'farm',
  description: 'description',
  sopLink: 'sopLink',
  groups: 'groups',
  workbins: 'workbins',
  source: 'source',
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const FARM_OS = 'FarmOS';
export const FARM_OPS = 'FarmOps';

function getSourceColumn() {
  const selectableItems: SelectableItem[] = [
    { name: FARM_OS, value: FARM_OS },
    { name: FARM_OPS, value: FARM_OPS },
  ];
  return {
    headerName: 'Source',
    field: fields.source,
    colId: fields.source,
    filterValueGetter: params =>
      params?.data?.definitionCreatedByInternalService ? selectableItems[0] : selectableItems[1],
    valueGetter: params =>
      params?.data?.definitionCreatedByInternalService ? selectableItems[0].value : selectableItems[1].value,
    filter: 'selectionFilter',
    filterParams: {
      multiple: true,
      selectableItems,
    },
  };
}

export function useAgGridWorkbinDefinitionTableConfig(
  workbinTaskDefinitionData: WorkbinTaskDefinition[]
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
          field: fields.shortTitle,
          colId: fields.shortTitle,
          valueGetter: params => params?.data?.shortTitle,
          checkboxSelection: true,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Workbins',
          field: fields.workbins,
          colId: fields.workbins,
          valueGetter: params => params?.data?.workbins,
          ...defaultAgTextContainsColumnFilter,
        },
        getSourceColumn(),
        {
          headerName: 'Triggers',
          field: fields.groups,
          colId: fields.groups,
          cellRendererFramework: params => (
            <AgGridListRenderer list={params?.data?.groups.map(value => value.groupName)} />
          ),
          valueGetter: params => params?.data?.groups,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Title',
          field: fields.title,
          colId: fields.title,
          valueGetter: params => params?.data?.title,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Farm',
          field: fields.farm,
          colId: fields.farm,
          valueGetter: params => params?.data?.farm,
          valueFormatter: params => getFarmNameFromFarmPath(params?.data?.farm),
        },
        {
          headerName: 'Description',
          sortable: false,
          field: fields.description,
          colId: fields.description,
          minWidth: 250,
          cellRendererFramework: params => (
            <AgGridDialogRenderer
              cellText={params?.data?.description}
              showCommentIcon
              dialogWidth="md"
              title={'Full description of task: ' + params?.data?.title}
              content={<Typography>{params?.data?.description}</Typography>}
            />
          ),
        },
        {
          headerName: 'SOP Link',
          sortable: false,
          field: fields.sopLink,
          colId: fields.sopLink,
          valueGetter: params => params?.data?.sopLink,
        },
        {
          headerName: 'ID',
          sortable: false,
          field: fields.id,
          colId: fields.id,
          valueGetter: params => params?.data?.id,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Created at',
          field: fields.createdAt,
          colId: fields.createdAt,
          valueGetter: params => DateTime.fromISO(params?.data?.createdAt),
          valueFormatter: params => params?.value?.toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS),
          ...defaultAgDateColumnFilterInRange,
        },
        {
          headerName: 'Updated at',
          field: fields.updatedAt,
          colId: fields.updatedAt,
          valueGetter: params => DateTime.fromISO(params?.data?.updatedAt),
          valueFormatter: params => params?.value?.toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS),
          ...defaultAgDateColumnFilterInRange,
        },
      ],
      context: {},
      frameworkComponents: { selectionFilter: SelectionFilter },
      blockLoadDebounceMillis: 500,
      tooltipShowDelay: 0,
      modules: AllCommunityModules,
      rowHeight: 48,
      suppressColumnVirtualisation: true,
      suppressRowClickSelection: true,
      rowSelection: 'single',
      rowData: workbinTaskDefinitionData,
      getRowNodeId: data => data.id,
      immutableData: true,
    }),
    [workbinTaskDefinitionData]
  );

  return agGridConfig;
}
