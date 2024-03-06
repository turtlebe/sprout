import { ColumnApi, ColumnState, GridApi } from '@ag-grid-community/all-modules';
import { getSortModel, setSortModel } from '@plentyag/core/src/ag-grid/utils';
import useCoreStore from '@plentyag/core/src/core-store';
import { CurrentUser } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { cols } from '../table-cols';
import { mergeState } from '../utils/merge-state';

import { useGetSampleIdQueryParameter } from './use-get-sample-id-query-parameter';

// version used to clear out old state if some state incompability arises in the future.
const version = 2;

export function getStorageKey(currentUser: CurrentUser) {
  return `lab-testing-grid-state-${currentUser.username}`;
}

function clearStorage(currentUser: CurrentUser) {
  window.localStorage.setItem(getStorageKey(currentUser), '');
}

// we only save a subset of values from ag-grid column state.
export type SavedState = Pick<ColumnState, 'colId' | 'width' | 'pinned'>;

export function getSavedFilterState(currentUser: CurrentUser) {
  let filterState = {};
  const stateStr = window.localStorage.getItem(getStorageKey(currentUser));
  if (stateStr) {
    try {
      const state = JSON.parse(stateStr);
      if (!state.ver || state.ver !== version) {
        return filterState;
      }
      if (state.filterState) {
        filterState = state.filterState;
      }
    } catch {
      return filterState;
    }
  }
  return filterState;
}

function restoreState({
  columnApi,
  gridApi,
  currentUser,
  disableRestoringFilter,
}: {
  columnApi: ColumnApi;
  gridApi: GridApi;
  currentUser: CurrentUser;
  disableRestoringFilter: boolean;
}) {
  const stateStr = window.localStorage.getItem(getStorageKey(currentUser));
  if (!stateStr) {
    return;
  }
  try {
    const state = JSON.parse(stateStr);
    if (!state.ver || state.ver !== version) {
      clearStorage(currentUser);
      return;
    }
    if (Array.isArray(state.colState)) {
      const currState = columnApi.getColumnState();
      const mergedState = mergeState(currState, state.colState);
      columnApi.applyColumnState({ state: mergedState, applyOrder: true });
    }
    if (state.sortState) {
      setSortModel(state.sortState, columnApi);
    }
    if (!disableRestoringFilter && state.filterState) {
      gridApi.setFilterModel(state.filterState);
    }
  } catch (err) {
    console.error('Could not parse saved grid state, ignoring saved state and clearing.');
    clearStorage(currentUser);
  }
}

/**
 * Save (to localstorage) the curr col state (colId, width, pinned), sort state and filter state.
 * Only columns in 'cols' enum are saved.
 */
function saveState(columnApi: ColumnApi, gridApi: GridApi, currentUser: CurrentUser) {
  const colsSet = new Set<string>(Object.values(cols)); // cols to save.
  const savedColumnState = columnApi
    .getColumnState()
    .filter(col => colsSet.has(col.colId))
    .map<SavedState>(state => {
      return {
        colId: state.colId,
        width: state.width,
        pinned: state.pinned,
      };
    });
  const newState = {
    ver: version,
    colState: savedColumnState,
    sortState: getSortModel(columnApi),
    filterState: gridApi.getFilterModel(),
  };

  window.localStorage.setItem(getStorageKey(currentUser), JSON.stringify(newState));
}

export function useSaveRestoreGridState(
  columnApi: ColumnApi | undefined,
  gridApi: GridApi | undefined,
  isTableReady: boolean
) {
  const state = useCoreStore()[0];

  const sampleIdQueryParameter = useGetSampleIdQueryParameter();

  React.useEffect(() => {
    if (isTableReady && gridApi && columnApi && state.currentUser) {
      const user = state.currentUser;
      const saveStateAfterEvent = () => {
        saveState(columnApi, gridApi, user);
      };

      restoreState({
        columnApi,
        gridApi,
        currentUser: state.currentUser,
        disableRestoringFilter: !!sampleIdQueryParameter,
      });

      if (!sampleIdQueryParameter) {
        gridApi.addEventListener('columnResized', saveStateAfterEvent);
        gridApi.addEventListener('columnPinned', saveStateAfterEvent);
        gridApi.addEventListener('columnMoved', saveStateAfterEvent);
        gridApi.addEventListener('sortChanged', saveStateAfterEvent);
        gridApi.addEventListener('filterChanged', saveStateAfterEvent);
      }

      return () => {
        gridApi.removeEventListener('columnResized', saveStateAfterEvent);
        gridApi.removeEventListener('columnPinned', saveStateAfterEvent);
        gridApi.removeEventListener('columnMoved', saveStateAfterEvent);
        gridApi.removeEventListener('sortChanged', saveStateAfterEvent);
        gridApi.removeEventListener('filterChanged', saveStateAfterEvent);
      };
    }
  }, [isTableReady, gridApi, columnApi, state.currentUser, sampleIdQueryParameter]);
}
