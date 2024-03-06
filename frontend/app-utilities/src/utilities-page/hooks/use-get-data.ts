import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

export interface GetDataResponse {
  sheet: string;
}

export const useGetData = () => {
  return useSwrAxios<GetDataResponse>({ url: '/api/utilities/data' });
};
