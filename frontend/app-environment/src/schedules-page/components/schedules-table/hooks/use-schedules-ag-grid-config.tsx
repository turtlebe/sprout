import { PATHS } from '@plentyag/app-environment/src/paths';
import { AgGridLinkRenderer, BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { buildAgTextColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { getShortenedPath } from '@plentyag/core/src/utils';
import moment from 'moment';
import React from 'react';

export interface UseSchedulesAgGridConfigReturn {
  config: BaseAgGridInfiniteTable['agGridConfig'];
}

const fields = {
  path: 'path',
  description: 'description',
  scheduleType: 'scheduleType',
  startsAt: 'startsAt',
  activatesAt: 'activatesAt',
  endsAt: 'endsAt',
  priority: 'priority',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const sortingQueryParamsMapping = {};

/**
 * AgGrid Config for the SchedulesTable.
 */
export const useSchedulesAgGridConfig = (): UseSchedulesAgGridConfigReturn => {
  return React.useMemo(
    () => ({
      config: {
        ...defaultConfig,
        columnDefs: [
          {
            field: fields.path,
            colId: fields.path,
            minWidth: 500,
            checkboxSelection: true,
            sortable: true,
            cellRendererFramework: params => (
              <AgGridLinkRenderer to={params.data && PATHS.schedulePage(params.data.id)}>
                {getShortenedPath(params.value)}
              </AgGridLinkRenderer>
            ),
            ...buildAgTextColumnFilter('contains'),
          },
          {
            field: fields.scheduleType,
            colId: fields.scheduleType,
          },
          {
            headerName: 'Start Time',
            field: fields.startsAt,
            colId: fields.startsAt,
          },
          {
            headerName: 'Activation Time',
            field: fields.activatesAt,
            colId: fields.activatesAt,
          },
          {
            headerName: 'End Time',
            field: fields.endsAt,
            colId: fields.endsAt,
          },
          {
            headerName: 'Priority',
            field: fields.priority,
            colId: fields.priority,
          },
          {
            field: fields.description,
            colId: fields.description,
          },
          {
            headerName: 'Created By',
            field: fields.createdBy,
            colId: fields.createdBy,
            ...buildAgTextColumnFilter('contains'),
          },
          {
            headerName: 'Updated By',
            field: fields.updatedBy,
            colId: fields.updatedBy,
            ...buildAgTextColumnFilter('contains'),
          },
          {
            headerName: 'Created At',
            field: fields.createdAt,
            colId: fields.createdAt,
            valueFormatter: params => moment(params.value).format('LLL'),
          },
          {
            headerName: 'Updated At',
            field: fields.updatedAt,
            colId: fields.updatedAt,
            valueFormatter: params => moment(params.value).format('LLL'),
          },
        ],
        getSortFilterServerParams: ({ sortModel, filterModel }) => {
          const sort = getSortingQueryParams(sortModel, colId => sortingQueryParamsMapping[colId]);
          const filters = getFilteringServerParams({
            filterModel,
            transformColId: (colId, filter) => {
              if (isTextFilterModel(filter) && colId === fields.path && filter.type === 'contains') {
                return 'pathContains';
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
    []
  );
};
