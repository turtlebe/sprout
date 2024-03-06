import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';

export interface UseReturn {
  isLoading: boolean;
  fetch: (serials: string[], onSuccess: (result: ProdResources.ResourceState[]) => void) => void;
}

/**
 * Hook to fetch a list of container states from given container serials numbers.
 */
export const useGetContainersResourceState = (): UseReturn => {
  const snackbar = useGlobalSnackbar();

  const { makeRequest, isLoading } = usePostRequest<ProdResources.ResourceState[], string[]>({
    url: '/api/plentyservice/traceability3/get-states-by-ids?id_type=CONTAINER_SERIAL',
  });

  const fetch: UseReturn['fetch'] = (serials, onSuccess) => {
    makeRequest({
      data: serials,
      onSuccess,
      onError: error =>
        snackbar.errorSnackbar({ title: 'Error loading container serial(s)', message: parseErrorMessage(error) }),
    });
  };

  return { isLoading, fetch };
};
