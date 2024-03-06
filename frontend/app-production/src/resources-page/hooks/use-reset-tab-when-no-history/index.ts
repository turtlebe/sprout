import React from 'react';

import { hasContainerOrMaterial } from '../../utils/hasContainerOrMaterial';

export interface UseResetTabWhenNoHistory {
  searchResult: ProdResources.ResourceState;
  currTab: string;
  setTab: (newTab: string) => void;
}

/**
 * Sets tab back to default tab ("info") when current history tab has no corresponding history
 * from the search results.
 * @searchResult The current resource search result.
 * @currTab The name of the current tab (string).
 * @setTab Function to change a tab.
 */
export const useResetTabWhenNoHistory = ({ searchResult, currTab, setTab }: UseResetTabWhenNoHistory) => {
  React.useEffect(() => {
    const { hasContainer, hasMaterial } = hasContainerOrMaterial(searchResult);
    if (
      searchResult &&
      ((currTab === 'material-history' && !hasMaterial) || (currTab === 'container-history' && !hasContainer))
    ) {
      setTab('info');
    }
  }, [searchResult, currTab]);
};
