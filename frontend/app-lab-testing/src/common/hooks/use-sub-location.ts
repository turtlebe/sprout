import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

export function useSublocations(farmDefPath?: string): { isLoading: boolean; locations?: string[]; hasError: boolean } {
  const result = useSwrAxios<any>(
    farmDefPath
      ? {
          url: `/api/plentyservice/lab-testing-service/get-sub-locations-from-farm-def-path?farm_def_path=${encodeURIComponent(
            farmDefPath
          )}`,
        }
      : null,
    { shouldRetryOnError: true }
  );

  const isLoading = (farmDefPath && !result.data) || result.isValidating;
  const hasError = !!result.error;
  const locations = result.data && Array.isArray(result.data.sub_locations) ? result.data.sub_locations : undefined;
  return { isLoading, locations, hasError };
}
