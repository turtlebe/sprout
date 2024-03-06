import { PATHS } from '@plentyag/app-environment/src/paths';
import { AgGridLinkRenderer, BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { buildAgTextColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { UsersDashboard } from '@plentyag/core/src/types/environment';
import moment from 'moment';
import React from 'react';

import { ButtonFavoriteDashboard } from '../components/button-favorite-dashboard';

export interface UsedashboardsAgGridConfigReturn {
  config: BaseAgGridInfiniteTable['agGridConfig'];
}

const fields = {
  favorite: 'favorite',
  name: 'name',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export { fields as dashboardFields };

const sortingQueryParamsMapping = {};

export const useDashboardsAgGridConfig = (usersDashboards: UsersDashboard[]): UsedashboardsAgGridConfigReturn => {
  return React.useMemo(
    () => ({
      config: {
        ...defaultConfig,
        columnDefs: [
          {
            field: fields.favorite,
            colId: fields.favorite,
            cellRendererFramework: params => {
              return params.data ? (
                <ButtonFavoriteDashboard dashboard={params.data} usersDashboards={usersDashboards} disableFetching />
              ) : null;
            },
            width: 74,
            resizable: false,
          },
          {
            field: fields.name,
            colId: fields.name,
            cellRendererFramework: params => (
              <AgGridLinkRenderer to={params.data && PATHS.dashboardPage(params.data.id)}>
                {params.value}
              </AgGridLinkRenderer>
            ),
            checkboxSelection: true,
            minWidth: 400,
            ...buildAgTextColumnFilter('contains'),
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
              if (isTextFilterModel(filter) && colId === fields.name && filter.type === 'contains') {
                return 'name';
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
    [usersDashboards]
  );
};
