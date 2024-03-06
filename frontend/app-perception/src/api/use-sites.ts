import { farmDefTypes } from '@plentyag/core/src/farm-def';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

interface FarmDefObjectsResponse {
  data: any[];
}

/**
 * Get list of sites from farm def
 *
 * @param kind the kind of object to get
 */
export function useSites() {
  const result = useSwrAxios<FarmDefObjectsResponse>(
    { url: '/api/plentyservice/farm-def-service/search-object?kind=site' },
    { shouldRetryOnError: true }
  );

  const objectNames: string[] = [];
  if (Array.isArray(result.data)) {
    const objects = result.data as farmDefTypes.FarmDefObject[];
    for (const object of objects) {
      // don't include duplicates
      if (!objectNames.includes(object.name)) {
        objectNames.push(object.name);
      }
    }
  }

  return objectNames;
}
