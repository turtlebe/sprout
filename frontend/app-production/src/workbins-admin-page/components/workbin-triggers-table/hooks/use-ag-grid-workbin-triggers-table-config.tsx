import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { useLoadWorkbinTaskDefinitions } from '@plentyag/app-production/src/common/hooks';
import { WorkbinTaskDefinition, WorkbinTaskTrigger } from '@plentyag/app-production/src/common/types/workspace';
import { getFarmNameFromFarmPath } from '@plentyag/app-production/src/common/utils';
import { AgGridDialogRenderer, BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultAgDateColumnFilterInRange } from '@plentyag/core/src/ag-grid/custom-filters/default-date-filters';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { truncate } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';

// TODO: Once WBS supports / returns updatedBy / createdBy these will also be added
export const fields = {
  groupName: 'groupName',
  workbin: 'workbin',
  farm: 'farm',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ordering: 'ordering',
};

function buildTableConfig(
  workbinTriggersData: WorkbinTaskTrigger[],
  workbinTaskDefinitions: WorkbinTaskDefinition[]
): BaseAgGridClientSideTable['agGridConfig'] {
  function orderingPrettyDisplay(ordering: object): string {
    if (ordering === null || ordering == undefined) {
      return 'None';
    }

    const definitionTypes = [];
    for (const definitionId of Object.values(ordering)) {
      const typesForId = workbinTaskDefinitions
        .filter(value => value.id == definitionId)
        .map(value => value.shortTitle);
      if (typesForId.length > 0) {
        definitionTypes.push(typesForId[0]);
      }
    }
    return JSON.stringify(definitionTypes);
  }

  function orderingShortDisplay(ordering: object): string {
    return !ordering ? 'None' : Object.keys(ordering).length + ' tasks';
  }

  return {
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
      lockPosition: true,
    },
    columnDefs: [
      {
        headerName: 'Name',
        sortable: true,
        field: fields.groupName,
        colId: fields.groupName,
        valueGetter: params => params?.data?.groupName,
        checkboxSelection: true,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Workbin',
        sortable: true,
        field: fields.workbin,
        colId: fields.workbin,
        valueGetter: params => params?.data?.workbin,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Workbin tasks',
        sortable: false,
        field: fields.ordering,
        colId: fields.ordering,
        cellRendererFramework: params => (
          <AgGridDialogRenderer
            cellText={orderingShortDisplay(params?.data?.ordering)}
            title={'Full ordering of definitions'}
            content={<Typography>{orderingPrettyDisplay(params?.data?.ordering)}</Typography>}
          />
        ),
        valueGetter: params => params?.data?.ordering,
      },
      {
        headerName: 'Farm',
        sortable: false,
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
        maxWidth: 150,
        cellRendererFramework: params => (
          <AgGridDialogRenderer
            cellText={truncate(params?.data?.description, { length: 10 })}
            title={'Full description of trigger: ' + params?.data?.title}
            content={<Typography>{params?.data?.description || ''}</Typography>}
          />
        ),
        valueGetter: params => params?.data?.description,
      },
      {
        headerName: 'Created at',
        sortable: true,
        field: fields.createdAt,
        colId: fields.createdAt,
        valueGetter: params => DateTime.fromISO(params?.data?.createdAt),
        valueFormatter: params => params?.value?.toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS),
        ...defaultAgDateColumnFilterInRange,
      },
      {
        headerName: 'Updated at',
        sortable: true,
        field: fields.updatedAt,
        colId: fields.updatedAt,
        valueGetter: params => DateTime.fromISO(params?.data?.updatedAt),
        valueFormatter: params => params?.value?.toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS),
        ...defaultAgDateColumnFilterInRange,
      },
    ],
    context: {},
    components: {},
    frameworkComponents: {},
    blockLoadDebounceMillis: 500,
    tooltipShowDelay: 0,
    modules: AllCommunityModules,
    rowHeight: 48,
    suppressColumnVirtualisation: true,
    suppressRowClickSelection: true,
    rowSelection: 'single',
    rowData: workbinTriggersData,
    getRowNodeId: data => data.groupId,
    immutableData: true,
  };
}

export function useAgGridWorkbinTriggersTableConfig(
  workbinTriggersData: WorkbinTaskTrigger[]
): BaseAgGridClientSideTable['agGridConfig'] {
  const [coreState] = useCoreStore();
  const { loadData, workbinTaskDefinitions } = useLoadWorkbinTaskDefinitions();

  const [tableConfig, setTableConfig] = React.useState<BaseAgGridClientSideTable['agGridConfig']>(
    buildTableConfig(workbinTriggersData, workbinTaskDefinitions)
  );

  React.useEffect(() => {
    loadData({ farm: coreState.currentUser.currentFarmDefPath, definitionCreatedByInternalService: false });
  }, []);

  React.useEffect(() => {
    setTableConfig(buildTableConfig(workbinTriggersData, workbinTaskDefinitions));
  }, [workbinTriggersData, workbinTaskDefinitions]);

  return tableConfig;
}
