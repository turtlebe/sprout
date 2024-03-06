import { dataTestids, RefreshButton } from '@plentyag/brand-ui/src/components/refresh-button';
import React from 'react';

import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';

import { useStyles } from './styles';

export { dataTestids };

export const SearchRefreshButton: React.FC = React.memo(() => {
  const classes = useStyles();

  const [searchResult, { refreshSearch }] = useSearch<SearchState['searchResult'], SearchActions>(
    state => state.searchResult
  );

  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();

  React.useEffect(() => {
    if (searchResult) {
      setLastRefreshedAt(new Date().toISOString());
    }
  }, [searchResult]);

  // don't render button when there is no search result or search result is historic (since refresh on historic data is pointless).
  return searchResult && searchResult.isLatest ? (
    <RefreshButton classes={{ text: classes.text }} lastRefreshedAt={lastRefreshedAt} onClick={refreshSearch} />
  ) : null;
});
