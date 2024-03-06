import { ColumnApi, ColumnState } from '@ag-grid-community/all-modules';

import { SortModel } from '../types';

/**
 * Wrapper around ag-grid since setSortModel has been deprecated.
 * see: https://www.ag-grid.com/ag-grid-changelog/?fixVersion=24.0.0
 * Note: code here taken from ag-grid implementation.
 * @param sortModel The sort state to save.
 * @param columnApi API to access the table column data.
 * @returns Returns false if one or more columns could not be found.
 */
export function setSortModel(sortModel: SortModel, columnApi: ColumnApi) {
  let columnState: ColumnState[] = [];
  if (sortModel) {
    sortModel.forEach(function (item, index) {
      columnState.push({
        colId: item.colId,
        sort: item.sort,
        sortIndex: index,
      });
    });
  }
  columnApi.applyColumnState({ state: columnState, defaultState: { sort: null } });
}
