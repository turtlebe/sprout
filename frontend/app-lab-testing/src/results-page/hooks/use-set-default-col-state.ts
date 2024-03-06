import { ColumnApi, ColumnState, GridApi } from '@ag-grid-community/all-modules';
import { getSortModel } from '@plentyag/core/src/ag-grid/utils';
import React from 'react';

export interface DefaultColState {
  col: ColumnState[];
  sort: any;
  filter: any;
}

/**
 * Gets the default column state (size, order, sorting, filtering) from the first columnDefs provided
 * that are greater than zero in length. This state can be used to reset the grid state back to orig.
 */
export function useSetDefaultColState(
  columnDefs: LT.ColumnDef,
  columnApi: ColumnApi | undefined,
  gridApi: GridApi | undefined
) {
  // used to hold original state, so we can use later use when resetting state.
  const [defaultColState, setDefaultColState] = React.useState<DefaultColState>();

  React.useEffect(() => {
    if (columnApi && gridApi && !defaultColState && columnDefs.length > 0) {
      columnApi.autoSizeAllColumns(false);
      setDefaultColState({
        col: columnApi.getColumnState(),
        sort: getSortModel(columnApi),
        filter: gridApi.getFilterModel(),
      });
    }
  }, [gridApi, columnApi, columnDefs]);

  return defaultColState;
}
