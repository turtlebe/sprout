import { ColDef } from '@ag-grid-community/all-modules';

import { FilterModel, FilterModelItem } from '../types';

import { getFilterValue } from '.';

export interface GetFilteringServerParams {
  filterModel: FilterModel;
  columnDefs?: ColDef[];
  transformColId?: (colId: string, filter: FilterModelItem) => string;
}
/**
 * Parse AgGrid FilterModel and return parameters to send to the server.
 *
 * @param params AgGrid datasource params
 * @return Filtering query parameters
 */
export function getFilteringServerParams({
  filterModel,
  columnDefs,
  transformColId = () => undefined,
}: GetFilteringServerParams) {
  if (Object.keys(filterModel).length === 0) {
    return {};
  }

  return Object.keys(filterModel).reduce((accumulator, colId) => {
    const filterModelItem = filterModel[colId];
    const mappedColId = transformColId(colId, filterModelItem) ?? colId;

    const colDef = columnDefs ? columnDefs.find(colDef => colDef.colId === colId) : undefined;

    accumulator[mappedColId] = getFilterValue(filterModelItem, colDef);

    return accumulator;
  }, {});
}
