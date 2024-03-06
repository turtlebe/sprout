import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

import { CropWithFarmInfo } from '../../common/types';

export const useLoadCrops = () => {
  const result = useSwrAxios<CropWithFarmInfo[]>({
    url: '/api/crops-skus/crops',
  });
  useLogAxiosErrorInSnackbar(result.error);
  return result;
};
