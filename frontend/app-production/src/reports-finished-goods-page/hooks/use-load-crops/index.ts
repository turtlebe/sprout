import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

export interface UseLoadCropsReturn {
  crops: FarmDefCrop[];
  isLoading: boolean;
}

export const useLoadCrops = (): UseLoadCropsReturn => {
  const url = '/api/plentyservice/farm-def-service/search-crops';
  const { data, error, isValidating } = useSwrAxios<FarmDefCrop[]>({
    url,
  });

  useLogAxiosErrorInSnackbar(error);

  return { crops: data, isLoading: isValidating };
};
