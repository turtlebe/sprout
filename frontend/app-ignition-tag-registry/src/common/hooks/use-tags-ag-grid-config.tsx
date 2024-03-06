import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getSelectionFilter, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';

import { TAG_STATUSES } from '../types';

import { useFetchTagProviders } from '.';

export const fields = {
  path: 'path',
  tagProvider: 'tagProvider',
  tagPath: 'tagPath',
  tagStatus: 'tagStatus',
  measurementType: 'measurementType',
  measurementUnit: 'measurementUnit',
  measurementName: 'measurementName',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export interface UseTagsAgGridConfigReturn {
  isValidating: UseSwrAxiosReturn<unknown, unknown>['isValidating'];
  config: BaseAgGridInfiniteTable['agGridConfig'];
}

export const useTagsAgGridConfig = (): UseTagsAgGridConfigReturn => {
  const { tagProviders, isLoading } = useFetchTagProviders();

  return {
    isValidating: isLoading,
    config: {
      ...defaultConfig,
      frameworkComponents: { selectionFilter: SelectionFilter },
      columnDefs: [
        {
          field: fields.path,
          colId: fields.path,
          checkboxSelection: true,
          minWidth: 300,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          field: fields.tagProvider,
          colId: fields.tagProvider,
          ...getSelectionFilter(tagProviders),
        },
        {
          field: fields.tagPath,
          colId: fields.tagPath,
          minWidth: 200,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          headerName: 'Observation Name',
          field: fields.measurementName,
          colId: fields.measurementName,
          ...defaultAgTextContainsColumnFilter,
        },
        {
          field: fields.measurementType,
          colId: fields.measurementType,
        },
        {
          field: fields.measurementUnit,
          colId: fields.measurementUnit,
        },
        {
          headerName: 'Creating User',
          field: fields.createdBy,
          colId: fields.createdBy,
        },
        {
          headerName: 'Modifying User',
          field: fields.updatedBy,
          colId: fields.updatedBy,
        },
        {
          headerName: 'Date Modified',
          field: fields.updatedAt,
          colId: fields.updatedAt,
        },
        {
          field: fields.tagStatus,
          colId: fields.tagStatus,
          ...getSelectionFilter(TAG_STATUSES),
        },
      ],
      getSortFilterServerParams: ({ sortModel, filterModel, columnDefs }) => {
        const sort = getSortingQueryParams(sortModel);
        const filters = getFilteringServerParams({ filterModel, columnDefs });

        return {
          ...sort,
          ...filters,
        };
      },
    },
  };
};
