import { DeviceType } from '@plentyag/app-devices/src/common/types';
import { ROUTES } from '@plentyag/app-devices/src/routes';
import { AgGridLinkRenderer, BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import {
  buildAgTextColumnFilter,
  defaultAgTextEqualsColumnFilter,
} from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { ISelectionFilter, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { getDeviceLocationPath } from '@plentyag/core/src/farm-def/utils';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';
import React from 'react';

function getDeviceTypeSelectionFilter(deviceTypes: DeviceType[]): ISelectionFilter {
  return {
    filter: 'selectionFilter',
    filterParams: {
      multiple: true,
      selectableItems: deviceTypes.map(deviceType => ({ name: deviceType.name, value: deviceType.name })),
    },
  };
}

const SEARCH_DEVICE_TYPES_URL = '/api/plentyservice/farm-def-service/search-device-types';

export const fields = {
  types: 'types',
  serial: 'serial',
  location: 'placedParentPath',
};

const sortingQueryParamsMapping = {
  [fields.location]: 'deviceLocationPath',
  [fields.types]: 'deviceTypeName',
};

export interface UseAgGridConfigReturn {
  isValidating: UseSwrAxiosReturn<unknown, unknown>['isValidating'];
  config: BaseAgGridInfiniteTable['agGridConfig'];
}

export function useAgGridConfig(): UseAgGridConfigReturn {
  const { data: deviceTypes = [], isValidating } = useSwrAxios<DeviceType[]>({ url: SEARCH_DEVICE_TYPES_URL });

  return React.useMemo(
    () => ({
      isValidating,
      config: {
        ...defaultConfig,
        components: {},
        frameworkComponents: { selectionFilter: SelectionFilter },
        columnDefs: [
          {
            field: fields.serial,
            colId: fields.serial,
            ...buildAgTextColumnFilter('contains'),
            minWidth: 500,
            cellRendererFramework: params => (
              <AgGridLinkRenderer to={params.data && ROUTES.devicePage(params.data.id)}>
                {params.value}
              </AgGridLinkRenderer>
            ),
            checkboxSelection: true,
          },
          {
            headerName: 'Device Type',
            field: fields.types,
            colId: fields.types,
            valueFormatter: params => params?.data?.deviceTypeName,
            ...getDeviceTypeSelectionFilter(deviceTypes),
          },
          {
            headerName: 'Location',
            field: fields.location,
            colId: fields.location,
            valueFormatter: params => getDeviceLocationPath(params?.data?.location),
            ...defaultAgTextEqualsColumnFilter,
            minWidth: 500,
          },
        ],
        getSortFilterServerParams: ({ sortModel, filterModel }) => {
          const sort = getSortingQueryParams(sortModel, colId => sortingQueryParamsMapping[colId]);
          const filters = getFilteringServerParams({
            filterModel,
            transformColId: (colId, filter) => {
              if (isTextFilterModel(filter) && colId === fields.serial && filter.type === 'contains') {
                return 'serialContains';
              }

              return colId;
            },
          });

          return {
            ...sort,
            ...filters,
          };
        },
      },
    }),
    [deviceTypes, isValidating]
  );
}
