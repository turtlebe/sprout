import { SortModel } from '../types';

import { SORT_BY_KEY } from './get-sort-model-from-query-params';

export interface SortingQueryParams {
  [SORT_BY_KEY]?: string;
  order?: string;
}

/**
 * Parse AgGrid SortModel and return sorting query parameters.
 *
 * @param params AgGrid datasource params
 * @param transformColId function to transform the colId to a new value in the sortBy parameter
 * @return Sorting query parameters
 */
export function getSortingQueryParams(
  sortModel: SortModel,
  transformColId: (colId: string) => string = () => undefined
): SortingQueryParams {
  if (sortModel.length === 0) {
    return {};
  }

  return {
    [SORT_BY_KEY]: transformColId(sortModel[0].colId) ?? sortModel[0].colId,
    order: sortModel[0].sort,
  };
}
