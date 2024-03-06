import { useGetRequest } from '@plentyag/core/src/hooks/use-axios';

export interface SamplesResponseData {
  success?: string; // has value if successfully fetched.
  error?: string; // has value if failed to fetch.
  details?: any; // details provided if success has value.
}

const url = '/api/plentyservice/lab-testing-service/list-lab-test-samples';

export const useLoadSamples = () => {
  const { error, isLoading, makeRequest } = useGetRequest<SamplesResponseData>({ url });
  return { error, isLoading, makeRequest };
};
