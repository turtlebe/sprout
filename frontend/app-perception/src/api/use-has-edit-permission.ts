import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

interface HasEditPermissionResponse {
  hasEditPermission: boolean;
}

/**
 * Check if the user has edit permission to add tags and labels
 */
export function useHasEditPermission() {
  const result = useSwrAxios<HasEditPermissionResponse>(
    { url: '/api/perception/has-edit-permission' },
    { shouldRetryOnError: true }
  );
  const hasEditPermission = result.data ? result.data.hasEditPermission : false;
  return hasEditPermission;
}
