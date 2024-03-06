import { FarmDefCropType } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

export interface UseSearchCropTypesReturn {
  isLoading: boolean;
  cropTypes: FarmDefCropType[];
}

export function useSearchCropTypes(): UseSearchCropTypesReturn {
  const {
    isValidating,
    data: cropTypes,
    error,
  } = useSwrAxios<FarmDefCropType[]>({
    url: '/api/plentyservice/farm-def-service/search-crop-types',
  });

  useLogAxiosErrorInSnackbar(error);

  return { isLoading: isValidating, cropTypes };
}
