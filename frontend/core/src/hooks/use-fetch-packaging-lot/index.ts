import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { PackagingLot } from '@plentyag/core/src/types';
import { toQueryParams } from '@plentyag/core/src/utils';

export interface UseFetchPackagingLotReturn {
  packagingLot: PackagingLot;
  isLoading: boolean;
}

export const PACKAGING_LOT_URL = '/api/plentyservice/traceability3/get-packaging-lot';

export const useFetchPackagingLot = (lotName: string): UseFetchPackagingLotReturn => {
  const queryParams = toQueryParams({
    packaging_lot_name: lotName,
  });

  const {
    data: packagingLot,
    isValidating: isLoading,
    error,
  } = useSwrAxios<PackagingLot>({
    url: lotName && `${PACKAGING_LOT_URL}${queryParams}`,
  });

  useLogAxiosErrorInSnackbar(error);

  return {
    packagingLot,
    isLoading,
  };
};
