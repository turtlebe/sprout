import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

import { SkuWithFarmInfo } from '../../common/types';

export const useLoadSkus = () => {
  const result = useSwrAxios<SkuWithFarmInfo[]>({
    url: '/api/crops-skus/skus',
  });
  useLogAxiosErrorInSnackbar(result.error);
  return result;
};
