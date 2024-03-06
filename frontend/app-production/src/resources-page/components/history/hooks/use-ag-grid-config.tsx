import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { AgGridLinkRenderer } from '@plentyag/brand-ui/src/components/ag-grid-link-renderer';
import { AgGridListRenderer } from '@plentyag/brand-ui/src/components/ag-grid-list-renderer';
import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { ISelectionFilter, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { getFormattedObjectKey, getFormattedObjectValue } from '@plentyag/core/src/utils';
import React from 'react';

import { SearchState } from '../../../hooks/use-search';
import { getPrettyDate } from '../../genealogy/utils';
import { getShortenedFarmDefPath, getStateOut, locationValueGetter } from '../utils';

import { useGetLabels } from './use-get-labels';

function getLabelsSelectionFilter(labels?: string[]): ISelectionFilter {
  return {
    filter: 'selectionFilter',
    filterParams: {
      multiple: true,
      selectableItems: labels?.map(label => ({ name: label, value: label })),
    },
  };
}

export const fields = {
  date: 'dt',
  type: 'type',
  operationLocation: 'locationSubstring',
  containerSerialAfter: 'containerSerialAfter',
  containerLocationAfter: 'locationAfter',
  containerLabelsAfter: 'containerLabels',
  containerStatusAfter: 'containerStatusAfter',
  materialLotNameAfter: 'materialLotNameAfter',
  materialCropAfter: 'materialCropAfter',
  materialLabelsAfter: 'materialLabels',
  materialStatusAfter: 'materialStatusAfter',
  materialParentAfter: 'materialParentAfter',
  materialPositionInParentAfter: 'materialPositionInParentAfter',
  materialChildrenAfter: 'materialChildrenAfter',
  materialAttributes: 'materialAttributes',
  operationProps: 'properties',
  materialIdAfter: 'materialIdAfter',
  containerIdAfter: 'containerIdAfter',
  processId: 'processId',
};

export function useAgGridConfig(
  historyType: string,
  searchResult: SearchState['searchResult']
): BaseAgGridInfiniteTable['agGridConfig'] {
  const { containerLabels, materialLabels } = useGetLabels(searchResult?.containerObj?.containerType);
  const { resourcesPageBasePath } = useAppPaths();

  return React.useMemo(
    () => ({
      ...defaultConfig,
      components: {},
      defaultColDef: { floatingFilter: true, sortable: false, resizable: true, lockPosition: true },
      frameworkComponents: { selectionFilter: SelectionFilter },
      columnDefs: [
        {
          headerName: 'Date',
          field: fields.date,
          colId: fields.date,
          valueGetter: params => getPrettyDate(params.data?.startDt),
          filter: 'agDateColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            filterOptions: ['inRange'],
            suppressAndOrCondition: true,
            browserDatePicker: true,
          },
        },
        {
          headerName: 'Operation Type',
          field: fields.type,
          colId: fields.type,
          filter: 'agTextColumnFilter',
          filterParams: {
            suppressAndOrCondition: true,
            filterOptions: ['contains', 'notContains'],
          },
        },
        {
          headerName: 'Operation Location',
          field: fields.operationLocation,
          colId: fields.operationLocation,
          valueGetter: params => getShortenedFarmDefPath(params.data?.machine),
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Container Serial After',
          field: fields.containerSerialAfter,
          colId: fields.containerSerialAfter,
          valueGetter: params => getStateOut(params)?.containerObj?.serial,
          cellRendererFramework: params => {
            const serial = params.getValue();
            return (
              <AgGridLinkRenderer to={serial && `${resourcesPageBasePath}?q=${serial}`}>{serial}</AgGridLinkRenderer>
            );
          },
        },
        {
          headerName: 'Container Location After',
          field: fields.containerLocationAfter,
          colId: fields.containerLocationAfter,
          valueGetter: locationValueGetter,
        },
        {
          headerName: 'Container Labels After',
          field: fields.containerLabelsAfter,
          colId: fields.containerLabelsAfter,
          valueGetter: params => getStateOut(params)?.containerLabels,
          cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
          ...getLabelsSelectionFilter(containerLabels),
        },
        {
          headerName: 'Container Status After',
          field: fields.containerStatusAfter,
          colId: fields.containerStatusAfter,
          valueGetter: params => getStateOut(params)?.containerStatus,
        },
        {
          headerName: 'Material Lot Name After',
          field: fields.materialLotNameAfter,
          colId: fields.materialLotNameAfter,
          valueGetter: params => getStateOut(params)?.materialObj?.lotName,
          cellRendererFramework: params => {
            const lotName = params.getValue();
            return (
              <AgGridLinkRenderer to={lotName && `${resourcesPageBasePath}?q=${lotName}`}>{lotName}</AgGridLinkRenderer>
            );
          },
        },
        {
          headerName: 'Material Crop After',
          field: fields.materialCropAfter,
          colId: fields.materialCropAfter,
          valueGetter: params => getStateOut(params)?.materialObj?.product,
        },
        {
          headerName: 'Material Labels After',
          field: fields.materialLabelsAfter,
          colId: fields.materialLabelsAfter,
          valueGetter: params => getStateOut(params)?.materialLabels,
          cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
          ...getLabelsSelectionFilter(materialLabels),
        },
        {
          headerName: 'Material Status After',
          field: fields.materialStatusAfter,
          colId: fields.materialStatusAfter,
          valueGetter: params => getStateOut(params)?.materialStatus,
        },
        {
          headerName: 'Material Parent After',
          field: fields.materialParentAfter,
          colId: fields.materialParentAfter,
          valueGetter: params => getStateOut(params)?.parentResourceStateId,
        },
        {
          headerName: 'Material Position in Parent After',
          field: fields.materialPositionInParentAfter,
          colId: fields.materialPositionInParentAfter,
          valueGetter: params => getStateOut(params)?.positionInParent,
        },
        {
          headerName: 'Material Children After',
          field: fields.materialChildrenAfter,
          colId: fields.materialChildrenAfter,
          valueGetter: params => getStateOut(params)?.childResourceStateIds,
          cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
        },
        {
          headerName: 'Material Addtl. Attributes',
          field: fields.materialAttributes,
          colId: fields.materialAttributes,
          valueGetter: params => {
            const properties = getStateOut(params)?.materialAttributes;
            if (properties) {
              return Object.keys(properties).map(
                key => `${getFormattedObjectKey(key)}: ${getFormattedObjectValue(properties[key])}`
              );
            }
          },
          cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
        },
        {
          headerName: 'Operation Properties',
          field: fields.operationProps,
          colId: fields.operationProps,
          valueGetter: params => {
            const properties = params?.data?.properties;
            if (properties) {
              return Object.keys(properties).map(key => `${key}: ${properties[key]}`);
            }
          },
          cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
        },
        {
          headerName: 'Material ID After',
          field: fields.materialIdAfter,
          colId: fields.materialIdAfter,
          valueGetter: params => getStateOut(params)?.materialId,
        },
        {
          headerName: 'Container ID After',
          field: fields.containerIdAfter,
          colId: fields.containerIdAfter,
          valueGetter: params => getStateOut(params)?.containerId,
        },
        {
          headerName: 'Process ID',
          field: fields.processId,
          colId: fields.processId,
        },
      ],
      blockLoadDebounceMillis: 100,
      getSortFilterServerParams: ({ sortModel, filterModel }) => {
        const sort = getSortingQueryParams(sortModel);
        const filters = getFilteringServerParams({ filterModel });
        const materialOrContainerId =
          historyType === 'material'
            ? { materialId: searchResult.materialId }
            : { containerId: searchResult.containerId };

        const filterType = isTextFilterModel(filterModel?.type) ? filterModel.type.type : undefined;

        const { ...updatedFilters } = filters;
        delete updatedFilters[fields.date];

        return {
          ...sort,
          ...updatedFilters,
          startDt: filters[fields.date]?.dateFrom,
          endDt: filters[fields.date]?.dateTo,
          ...materialOrContainerId,
          filterType,
        };
      },
    }),
    [containerLabels, materialLabels, historyType, searchResult, resourcesPageBasePath]
  );
}
