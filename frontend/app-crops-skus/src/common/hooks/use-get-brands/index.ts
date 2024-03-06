import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

import { Brands } from '../../types';

export const useGetBrands = () => {
  const result = useSwrAxios<Brands>({
    url: '/api/plentyservice/farm-def-service/brand-types',
  });
  useLogAxiosErrorInSnackbar(result.error);
  return result;
};
