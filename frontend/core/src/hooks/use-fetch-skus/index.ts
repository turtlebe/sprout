import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { toQueryParams } from '@plentyag/core/src/utils';
import { useMemo } from 'react';

export interface UseFetchSkusReturn {
  skus: FarmDefSku[];
  skusRecord: Record<string, FarmDefSku>;
  isLoading: boolean;
}

export const SKUS_URL = '/api/plentyservice/farm-def-service/search-skus-by-farm-path';

export const useFetchSkus = (siteName?: string, farmName?: string): UseFetchSkusReturn => {
  const queryParams = toQueryParams(
    {
      farmPath: siteName && farmName ? `sites/${siteName}/farms/${farmName}` : undefined,
    },
    { encodeKeyUsingSnakeCase: true }
  );

  const {
    data: skus,
    error,
    isValidating,
  } = useSwrAxios<FarmDefSku[]>({
    url: `${SKUS_URL}${queryParams}`,
  });

  useLogAxiosErrorInSnackbar(error);

  const skusRecord: Record<string, FarmDefSku> = useMemo(() => {
    return skus
      ? skus.reduce((agg, sku) => {
          const { name } = sku;
          agg[name] = sku;
          return agg;
        }, {})
      : {};
  }, [skus]);

  return { skus, skusRecord, isLoading: isValidating };
};
