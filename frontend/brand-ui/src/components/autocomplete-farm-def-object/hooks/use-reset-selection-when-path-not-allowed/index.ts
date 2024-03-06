import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '..';
import { isChildOrParentPath } from '../../utils';

export const useResetSelectionWhenPathNotAllowed = (id: string, initialPath: string, allowedPaths?: string[]) => {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);

  React.useEffect(() => {
    if (
      allowedPaths &&
      state.selectedFarmDefObject &&
      !isChildOrParentPath(allowedPaths, state.selectedFarmDefObject.path)
    ) {
      const initialPathObj = initialPath && state.farmDefObjects?.find(obj => obj.path === initialPath);
      if (initialPathObj) {
        actions.setSelectedFarmDefObject(initialPathObj);
        actions.setInputvalue(initialPath);
      } else {
        actions.setSelectedFarmDefObject(null);
        actions.setInputvalue('');
      }
      actions.setIsOpen(false);
    }
  }, [allowedPaths, state.selectedFarmDefObject]);
};
