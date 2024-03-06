import { useQueryParam } from '@plentyag/core/src/hooks';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { SearchActions, SearchState, useSearch } from '../use-search';

export function useSearchQueryParameter() {
  const [lastSearchTerm, { search }] = useSearch<SearchState['lastSearchTerm'], SearchActions>(
    state => state.lastSearchTerm
  );
  const history = useHistory();
  const searchQueryParam = useQueryParam().get('q');

  React.useEffect(() => {
    if (searchQueryParam && searchQueryParam !== lastSearchTerm) {
      search(searchQueryParam);
    }
  }, [searchQueryParam]);

  React.useEffect(() => {
    if (searchQueryParam !== lastSearchTerm && lastSearchTerm !== undefined) {
      history.push({
        search: lastSearchTerm ? `q=${lastSearchTerm}` : '',
      });
    }
  }, [lastSearchTerm]);
}
