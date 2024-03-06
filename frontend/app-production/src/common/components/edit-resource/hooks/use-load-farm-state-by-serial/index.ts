import { FarmStateContainer } from '@plentyag/app-production/src/common/types/farm-state';
import { useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

export interface UseLoadFarmStateReturn {
  farmStateContainer: FarmStateContainer;
  revalidate: () => Promise<boolean>;
  isValidating: boolean;
}

export const useLoadFarmStateBySerial = (serial: string): UseLoadFarmStateReturn => {
  const url = serial && `/api/plentyservice/executive-service/get-container-by-serial/${serial}`;
  const { data, error, revalidate, isValidating } = useSwrAxios<FarmStateContainer>({
    url,
  });

  useLogAxiosErrorInSnackbar(error);

  return {
    farmStateContainer: data,
    revalidate,
    isValidating,
  };
};
