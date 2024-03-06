import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';

import { AgGridConfig } from '../types';

export const getSortFilterServerParams: AgGridConfig['getSortFilterServerParams'] = ({ filterModel, sortModel }) => {
  const sortingQueryParams = getSortingQueryParams(sortModel);
  const filteringQueryParams = getFilteringServerParams({ filterModel });

  return {
    ...sortingQueryParams,
    ...filteringQueryParams,
  };
};
