import { useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

const SEARCH_TAG_PATHS_URL = '/api/swagger/ignition-ingest-service/ignition-tag-api/tag-paths/';

export interface UseFetchTagPathsReturn {
  tagPaths: string[];
  isLoading: boolean;
}

/**
 * Simple hook to fetch and cache (for 30 minutes) Tag Paths from ignition-ingest.
 */
export const useFetchTagPaths = (tagProvider: string): UseFetchTagPathsReturn => {
  const [tagPaths, setTagPaths] = React.useState<string[]>();
  const { data, isValidating: isLoading } = useSwrAxios<string[]>(
    { url: SEARCH_TAG_PATHS_URL + tagProvider },
    { dedupingInterval: 60000 * 30 }
  );

  React.useEffect(() => {
    if (data) {
      setTagPaths(data);
    }
  }, [data]);

  return {
    // "?? data" because there is a chance the data is already cached by useSwrAxios but the React.useEffect hasn't triggered yet
    // so tagPaths is undefined and data is defined.
    tagPaths: tagPaths ?? data,
    isLoading: !data && isLoading,
  };
};
