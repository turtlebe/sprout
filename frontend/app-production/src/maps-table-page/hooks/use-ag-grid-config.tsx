import { AllCommunityModules, RowNode } from '@ag-grid-community/all-modules';
import { AgGridLinkRenderer } from '@plentyag/brand-ui/src/components/ag-grid-link-renderer';
import { AgGridListRenderer } from '@plentyag/brand-ui/src/components/ag-grid-list-renderer';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import {
  defaultAgTextContainsColumnFilter,
  defaultAgTextContainsOrBlankFilter,
} from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import React from 'react';

import { AgGridContainerLocationRenderer } from '../components';
import { MapTable } from '../types';
import { getKindValue } from '../utils';

import { useGetMapTableWithConflictsBrokenOut } from '.';

export const fields = {
  site: 'site',
  area: 'area',
  line: 'line',
  machine: 'machine',
  containerLocation: 'containerLocation',
  containerSerial: 'containerSerial',
  containerType: 'containerType',
  resourceId: 'resourceId',
  materialLotName: 'materialLotName',
  crop: 'crop',
  containerLabels: 'containerLabels',
  materialLabels: 'materialLabels',
  containerStatus: 'containerStatus',
};

export function useAgGridConfig(
  mapTable: MapTable,
  resourcesPageBasePath: string
): BaseAgGridClientSideTable['agGridConfig'] {
  const columnDefs = React.useMemo<BaseAgGridClientSideTable['agGridConfig']['columnDefs']>(
    () => [
      {
        headerName: 'Site',
        sortable: false,
        field: fields.site,
        colId: fields.site,
        valueGetter: params => getKindValue(params?.data?.path, 'sites'),
      },
      {
        headerName: 'Area',
        sortable: false,
        field: fields.area,
        colId: fields.area,
        valueGetter: params => getKindValue(params?.data?.path, 'areas'),
      },
      {
        headerName: 'Line',
        field: fields.line,
        colId: fields.line,
        valueGetter: params => getKindValue(params?.data?.path, 'lines'),
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Machine',
        field: fields.machine,
        colId: fields.machine,
        valueGetter: params => getKindValue(params?.data?.path, 'machines'),
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Container Location',
        field: fields.containerLocation,
        colId: fields.containerLocation,
        // eslint-disable-next-line max-params
        comparator: (valueA: string, valueB: string, nodeA: RowNode, nodeB: RowNode) => {
          // sort by container index since containerLocation can not be sort correctly - contains letters and numbers.
          const containerLocationIndexA = nodeA.data['containerLocationIndex'] || 0;
          const containerLocationIndexB = nodeB.data['containerLocationIndex'] || 0;
          return containerLocationIndexA - containerLocationIndexB;
        },
        valueGetter: params => getKindValue(params?.data?.path, 'containerLocations'),
        cellRendererFramework: params => (
          <AgGridContainerLocationRenderer
            containerLocation={params?.value}
            hasConflicts={params?.data?.conflicts?.length > 0}
          />
        ),
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Container Serial',
        field: fields.containerSerial,
        colId: fields.containerSerial,
        minWidth: 275,
        valueGetter: params => params?.data?.resource?.containerSerial,
        cellRendererFramework: params => {
          const serial = params?.data?.resource?.containerSerial;
          return (
            <AgGridLinkRenderer to={serial && `${resourcesPageBasePath}?q=${serial}`}>{serial}</AgGridLinkRenderer>
          );
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Container Type',
        field: fields.containerType,
        colId: fields.containerType,
        valueGetter: params => params?.data?.resource?.containerType,
        ...defaultAgTextContainsOrBlankFilter,
      },
      {
        headerName: 'Material Lot Name',
        field: fields.materialLotName,
        colId: fields.materialLotName,
        minWidth: 350,
        valueGetter: params => params?.data?.resource?.materialLotName,
        cellRendererFramework: params => {
          const lotName = params?.data?.resource?.materialLotName;
          return (
            <AgGridLinkRenderer to={lotName && `${resourcesPageBasePath}?q=${lotName}`}>{lotName}</AgGridLinkRenderer>
          );
        },
      },
      {
        headerName: 'Crop',
        field: fields.crop,
        colId: fields.crop,
        valueGetter: params => params?.data?.resource?.crop,
        ...defaultAgTextContainsOrBlankFilter,
      },
      {
        headerName: 'Container Labels',
        field: fields.containerLabels,
        colId: fields.containerLabels,
        valueGetter: params => params?.data?.resource?.containerLabels,
        cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Material Labels',
        field: fields.materialLabels,
        colId: fields.materialLabels,
        valueGetter: params => params?.data?.resource?.materialLabels,
        cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Container Status',
        field: fields.containerStatus,
        colId: fields.containerStatus,
        valueGetter: params => params?.data?.resource?.containerStatus,
        ...defaultAgTextContainsColumnFilter,
      },
    ],
    []
  );

  // break out conflict items into their own row, so we can render each on it's own row.
  const mapTableWithConflicitsBrokenOutIntoRows = useGetMapTableWithConflictsBrokenOut(mapTable);

  const agGridConfig: BaseAgGridClientSideTable['agGridConfig'] = {
    components: {},
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
      lockPosition: true,
    },
    columnDefs,
    modules: AllCommunityModules,
    rowHeight: 48,
    suppressColumnVirtualisation: true,
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    rowData: mapTableWithConflicitsBrokenOutIntoRows,
    getRowNodeId: data => data?.ref, // unique id for each row.
    immutableData: true,
  };

  return agGridConfig;
}
