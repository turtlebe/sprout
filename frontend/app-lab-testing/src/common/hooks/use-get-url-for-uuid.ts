import { useGetRequest } from '@plentyag/core/src/hooks/use-axios';

/**
 * Hook to fetch temporary s3 url.
 * Note this a temporary s3 url, so can not use 'useSWR' because it would cache result.
 * @param uuid  id of the s3 bucket containing url.
 */
export function useGetUrlForUuid(uuid: string) {
  const url = `/api/plentyservice/lab-testing-service/get-url-for-s3-file-uuid/${uuid}`;
  const { isLoading, makeRequest } = useGetRequest({ url });
  return { isLoading, makeRequest };
}
