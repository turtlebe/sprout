import { ColumnApi, ColumnState, GridApi } from '@ag-grid-community/all-modules';
import { setSortModel } from '@plentyag/core/src/ag-grid/utils';
import React from 'react';

import { ResetGridOptions } from '../interface-types';

import { DefaultColState } from './use-set-default-col-state';

/**
 * Hook to run when grid is initialized (i.e., gridApi and columnApi are both available).
 * Calls function onTableReady when grid is initialized - to expose various grid functionality
 * to the consumer (e.g., reset the grid state).
 * @param columnApi Ag-Grid api to control column info.
 * @param gridApi  Ag-Grid main api to control the grid.
 * @param defaultColState Default col state when first starting app.
 * @param onTableReady Callback will be called when grid is initialzed.
 */
export function useGridInit({
  columnApi,
  gridApi,
  defaultColState,
  onTableReady,
}: {
  columnApi: ColumnApi | undefined;
  gridApi: GridApi | undefined;
  defaultColState: DefaultColState | undefined;
  onTableReady?: LT.TableApiCallback;
}) {
  const [isTableReady, setIsTableReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!gridApi || !columnApi || !defaultColState) {
      return;
    }

    function clearSelection() {
      gridApi?.deselectAll();
    }

    /**
     * Restore the col state (size/order) to original/default state. Some new columns might
     * have been added or removed (ex: test columns). any cols not in the original
     * will be tacked onto the end.
     * @param origCol Original col state before modifications (default state)
     */
    function restoreColState(origCol: ColumnState[]) {
      if (columnApi) {
        const itemsNotInOrig = columnApi
          .getColumnState()
          .filter(curr => !origCol.some(col => col.colId === curr.colId));
        columnApi.applyColumnState({ state: origCol.concat(itemsNotInOrig), applyOrder: true });
      }
    }

    function resetGrid(option: ResetGridOptions) {
      if (columnApi && gridApi && defaultColState) {
        switch (option) {
          case 'All':
            restoreColState(defaultColState.col);
            setSortModel(defaultColState.sort, columnApi);
            gridApi.setFilterModel(defaultColState.filter);
            break;
          case 'Column Order/Size':
            restoreColState(defaultColState.col);
            break;
          case 'Filters':
            gridApi.setFilterModel(defaultColState.filter);
            break;
        }
        clearSelection();
      }
    }

    function refreshCache() {
      gridApi?.refreshInfiniteCache();
    }

    if (onTableReady) {
      onTableReady({ resetGrid, clearSelection, refreshCache, gridApi, columnApi });
      setIsTableReady(true);
    }
  }, [gridApi, columnApi, defaultColState, onTableReady]);

  return isTableReady;
}
