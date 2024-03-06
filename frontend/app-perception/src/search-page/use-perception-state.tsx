import { fetchSearchResults } from '@plentyag/app-perception/src/api/fetch-search-results';
import { SearchFields, SearchResult } from '@plentyag/app-perception/src/common/types/interfaces';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { PATHS } from '../paths';

export function usePerceptionState() {
  const history = useHistory();
  const [searchFields, setSearchFields] = useState<SearchFields>(null);
  const [results, setResults] = useState<SearchResult[]>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // options are 'grid', 'gallery' and 'labeling'
  const [currentView, setCurrentView] = useState<string>('grid');
  const pageSize = 100;

  /**
   * Create a query string for the search field values and add it to the URL
   *
   * @param searchFields Search field values
   * @param currentPage Current page of results
   */
  const addSearchToUrl = (searchFields: {}, currentPage: number) => {
    const searchParams = new URLSearchParams();
    for (const field in searchFields) {
      // the formgen may pass empty strings for values and those should not be added to url
      if (searchFields[field]) {
        searchParams.append(field, searchFields[field]);
      }
    }
    searchParams.append('page', `${currentPage}`);
    history.push(`${PATHS.searchPage}?${searchParams.toString()}`);
  };

  /**
   * Fetch new search results each time the user inputs new search field values
   */
  useEffect(() => {
    if (searchFields) {
      setLoading(true);
      addSearchToUrl(searchFields, currentPage);

      (function fetchResults() {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchSearchResults(searchFields, currentPage)
          .then(data => {
            const result = data;
            const success = 200;
            if (result.data && result.status === success) {
              setResults(result.data.data.results);
              setTotalPages(Math.ceil(result.data.data.count / pageSize));
            } else {
              setResults([]);
              setTotalPages(1);
              setError(result.statusText);
            }
          })
          .catch(e => {
            setError(e.message);
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    }
  }, [searchFields, currentPage]);

  return {
    results,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    currentView,
    setCurrentView,
    searchFields,
    setSearchFields,
  };
}
