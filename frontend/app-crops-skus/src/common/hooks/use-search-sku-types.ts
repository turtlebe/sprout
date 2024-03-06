import { FarmDefSkuType } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

export interface UseSearchSkuTypesReturn {
  isLoading: boolean;
  skuTypes: FarmDefSkuType[];
}

export function useSearchSkuTypes(): UseSearchSkuTypesReturn {
  const {
    isValidating,
    data: skuTypes,
    error,
  } = useSwrAxios<FarmDefSkuType[]>({
    url: '/api/plentyservice/farm-def-service/search-sku-types',
  });

  useLogAxiosErrorInSnackbar(error);

  return { isLoading: isValidating, skuTypes };
}
