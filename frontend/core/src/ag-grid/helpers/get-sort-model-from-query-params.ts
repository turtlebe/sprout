import { ColDef } from '@ag-grid-community/all-modules';

import { SortModel } from '../types';

export const SORT_BY_KEY = 'sortBy';

/**
 * Given query parameters and AgGrid columns definition, reconstruct the AgGrid SortModel object.
 *
 * @param queryParams URL query parameters
 * @param columnDefs Current column definitons
 * @return AgGrid SortModel
 */
export function getSortModelFromQueryParams(queryParams: URLSearchParams, columnDefs: ColDef[]): SortModel {
  if (!queryParams.has(SORT_BY_KEY) || !queryParams.has('order')) {
    return [];
  }

  const sortBy = queryParams.get(SORT_BY_KEY);
  const order = queryParams.get('order');
  const sortedColDef = columnDefs.find(colDef => colDef.field === sortBy);

  if (!sortedColDef) {
    return [];
  }

  if (!['asc', 'desc'].includes(order)) {
    return [];
  }

  return [{ colId: sortedColDef.colId ?? sortedColDef.field, sort: order as 'asc' | 'desc' }];
}
