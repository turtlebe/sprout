import { useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

const SEARCH_TAG_PROVIDERS_URL = '/api/swagger/ignition-ingest-service/ignition-tag-api/providers';

export interface UseFetchTagProvidersReturn {
  tagProviders: string[];
  isLoading: boolean;
}

/**
 * Simple hook to fetch and cache (for 30 minutes) Tag Providers from ignition-ingest.
 */
export const useFetchTagProviders = (): UseFetchTagProvidersReturn => {
  const [tagProviders, setTagProviders] = React.useState<string[]>();
  const { data, isValidating: isLoading } = useSwrAxios<string[]>(
    { url: SEARCH_TAG_PROVIDERS_URL },
    { dedupingInterval: 60000 * 30 }
  );

  React.useEffect(() => {
    if (data) {
      setTagProviders(data);
    }
  }, [data]);

  return {
    // "?? data" because there is a chance the data is already cached by useSwrAxios but the React.useEffect hasn't triggered yet
    // so tagProviders is undefined and data is defined.
    tagProviders: tagProviders ?? data,
    isLoading: !data && isLoading,
  };
};
