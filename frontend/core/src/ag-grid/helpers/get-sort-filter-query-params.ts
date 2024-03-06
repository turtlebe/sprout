import { getFilteringQueryParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';

import { AgGridConfig } from '../types';

export const getSortFilterQueryParams: AgGridConfig['getSortFilterServerParams'] = ({
  filterModel,
  sortModel,
  columnDefs,
}) => {
  const sortingQueryParams = getSortingQueryParams(sortModel);
  const filteringQueryParams = getFilteringQueryParams(filterModel, columnDefs);

  return {
    ...sortingQueryParams,
    ...filteringQueryParams,
  };
};
