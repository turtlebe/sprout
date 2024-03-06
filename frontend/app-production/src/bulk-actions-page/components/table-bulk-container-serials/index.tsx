import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { AgGridReactProps } from '@ag-grid-community/react';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { AgGridListRenderer } from '@plentyag/brand-ui/src/components/ag-grid-list-renderer';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import React from 'react';

import { Container } from '../../types';

import { containerSerialValueSetter, getLocation } from './utils';

function getValueData(params: any): Container {
  return params?.data;
}

export interface TableBulkContainerSerials {
  containers: Container[];
  onSelectedSerialsChanged: (serials: string[]) => void;
  onSerialChanged: (oldSerial: string, newSerial: string) => void;
}

/**
 * Displays a table of user provided container serial numbers - along with details
 * about the each serial number. Actions can then performed on the selected
 * items in the table.
 */
export const TableBulkContainerSerials: React.FC<TableBulkContainerSerials> = ({
  containers,
  onSelectedSerialsChanged,
  onSerialChanged,
}) => {
  const handleSelectionChanged: AgGridReactProps['onSelectionChanged'] = event => {
    const selectedSerials = event.api.getSelectedRows().map(item => item.serial);
    onSelectedSerialsChanged(selectedSerials);
  };

  const columnDefs: BaseAgGridClientSideTable['agGridConfig']['columnDefs'] = [
    {
      headerName: 'Container Serial',
      colId: 'serial',
      field: 'serial',
      editable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      valueGetter: params => params?.data?.serial,
      valueSetter: params =>
        containerSerialValueSetter({
          newSerialNumber: params.newValue,
          oldSerialNumber: params.oldValue,
          containers,
          onSerialChanged,
        }),
      minWidth: 300,
    },
    {
      headerName: 'Serial Status',
      colId: 'status',
      field: 'status',
      valueGetter: params => getValueData(params)?.serialStatus,
      ...defaultAgTextContainsColumnFilter,
      minWidth: 150,
    },
    {
      headerName: 'Container Type',
      colId: 'containerType',
      field: 'containerType',
      valueGetter: params => getValueData(params)?.resourceState?.containerObj?.containerType,
      width: 150,
    },
    {
      headerName: 'Crop',
      colId: 'crop',
      field: 'crop',
      valueGetter: params => getValueData(params)?.resourceState?.materialObj?.product,
      width: 100,
    },
    {
      headerName: 'Location',
      colId: 'location',
      field: 'location',
      valueGetter: params => getLocation(getValueData(params)?.resourceState?.location),
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: 'Container Labels',
      colId: 'containerLabels',
      field: 'containerLabels',
      valueGetter: params => getValueData(params)?.resourceState?.containerLabels,
      cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: 'Material Labels',
      colId: 'materialLabels',
      field: 'materialLabels',
      valueGetter: params => getValueData(params)?.resourceState?.materialLabels,
      cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
      minWidth: 200,
      flex: 1,
    },
  ];

  const agGridConfig: BaseAgGridClientSideTable['agGridConfig'] = {
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
      lockPosition: true,
    },
    columnDefs,
    modules: AllCommunityModules,
    rowHeight: 48,
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    rowData: containers,
    getRowNodeId: data => data?.serial, // unique id for each row.
    singleClickEdit: true,
    overlayNoRowsTemplate: 'No Container Serial numbers have been added, click +SERIALS button to start.',
  };

  return (
    <BaseAgGridClientSideTable
      agGridConfig={agGridConfig}
      onSelectionChanged={handleSelectionChanged}
      persistFilterAndSortModelsInLocalStorage={false}
      enableAutoSizeAllColumns={false}
      updateFilterAndSortQueryParameters={false}
    />
  );
};
