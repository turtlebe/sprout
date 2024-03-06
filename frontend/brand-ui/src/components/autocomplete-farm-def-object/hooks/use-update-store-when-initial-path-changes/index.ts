import React from 'react';
import { usePrevious } from 'react-use';

import { useAutocompleteFarmDefObjectStore } from '..';

/**
 * When AutocompleteFarmDefObject re-render with an initialPath equals to '', reset the input value
 * and selected farm def object in the store.
 *
 * This use-case is when the caller reset the initialPath to ''. Note that the intialPath must have
 * been equal the selectedFarmDefObject in the previous render.
 *
 * @param id @see AutocompleteFarmDefObject['id']
 * @param initialPath @see AutocompleteFarmDefObject['initialPath']
 */
export const useUpdateStoreWhenInitialPathChanges = (id: string, initialPath: string): void => {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);
  const previousInitialPath = usePrevious(initialPath);

  React.useEffect(() => {
    if (
      state.inputValue &&
      state.selectedFarmDefObject &&
      previousInitialPath === state.selectedFarmDefObject.path &&
      initialPath === ''
    ) {
      actions.setInputvalue('');
      actions.setSelectedFarmDefObject(null);
    }
  }, [state.inputValue, state.selectedFarmDefObject, previousInitialPath, initialPath]);
};
