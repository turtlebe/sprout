import { ColumnState } from '@ag-grid-community/all-modules';
import { clone } from 'lodash';

import { SavedState } from '../hooks/use-save-restore-grid-state';

/**
 * Orders currState by savedState and copies matching items over to currState.
 * The merge does not touch or order items in currState that do not exist in savedState.
 * This is so for example newly added items to currState preserve their relative order.
 * For example:
 *   saveState: [ { ColId: '2'}, { ColId: '3'}, { ColId: '1'} ]
 *   currState:  [ { ColId: '1'}, { ColId: '4'}, { ColId: '2'} ]
 *   mergedState: [ { ColId: '2'}, { ColId: '4'}, { ColId: '1'} ]
 *   mergedState is order by 2 and 1 in savedState and dropping col 3 since it no longer exists in currState.
 * @param currState  State to be ordered and merged from savedState.
 * @param savedState List of previously saved items that should dictate order and content of currState.
 */
export function mergeState(currState: ColumnState[], savedState: SavedState[]) {
  if (!currState || !savedState || savedState.length === 0) {
    return currState;
  }

  // remove savedState item that don't exist in currState - they are columns that no longer exist
  // in curr state.
  const _savedState: SavedState[] = [];
  for (const i of savedState) {
    if (currState.some(item => item.colId === i.colId)) {
      _savedState.push(i);
    }
  }

  // clone so we don't modify our input.
  const mergedState = clone(currState);

  // order items in currState by matching items in _savedState.
  let saveStateIndex = 0;
  let mergeStateIndex = 0;
  for (const mergedStateItem of mergedState) {
    if (_savedState.some(savedItem => savedItem.colId === mergedStateItem.colId)) {
      Object.assign(mergedState[mergeStateIndex], _savedState[saveStateIndex]);
      saveStateIndex++;
    }
    mergeStateIndex++;
  }

  return mergedState;
}
