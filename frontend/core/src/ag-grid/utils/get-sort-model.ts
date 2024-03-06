import { ColumnApi } from '@ag-grid-community/all-modules';

import { SortModel } from '../types';

/**
 * Wrapper around ag-grid since getSortModel has been deprecated.
 * see: https://www.ag-grid.com/ag-grid-changelog/?fixVersion=24.0.0
 * Note: code here taken from ag-grid implementation.
 * @param columnApi API to access the table column data.
 * @returns The sort model for the table.
 */
export function getSortModel(columnApi: ColumnApi): SortModel {
  const filteredStates = columnApi.getColumnState().filter(item => item.sort != null);
  const indexes = {};
  filteredStates.forEach(state => {
    const id = state.colId;
    const sortIndex = state.sortIndex;
    indexes[id] = sortIndex;
  });
  const res = filteredStates.map(s => ({ colId: s.colId, sort: s.sort }));
  res.sort((a, b) => indexes[a.colId] - indexes[b.colId]);
  return res;
}
