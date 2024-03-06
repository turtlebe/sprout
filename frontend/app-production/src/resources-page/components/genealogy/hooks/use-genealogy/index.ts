import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

const url = '/api/plentyservice/traceability3/get-summarized-genealogy';
export function useGenealogy(id: string) {
  const { data, error, isValidating } = useSwrAxios<ProdResources.FocusedResource>(
    id && { url: `${url}/${id}`, params: { max_number_operations: 100, max_number_focused_resource_operations: 500 } }
  );

  const isLoading = id && !error && (isValidating || !data);
  return { isLoading, error, data };
}
