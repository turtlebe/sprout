import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { toQueryParams } from '@plentyag/core/src/utils';

import { GET_TALLY_BY_SKU } from '../../constants';
import { PostharvestSkuTally } from '../../types';

export interface UseFetchPostharvestTallyBySku {
  siteName: string;
  farmName: string;
  lotName: string;
  skuName: string;
}
export interface UseFetchPostharvestTallyBySkuReturn {
  postharvestSkuTally: PostharvestSkuTally;
  revalidate: () => Promise<boolean>;
  isLoading: boolean;
}

export const useFetchPostharvestTallyBySku = ({
  siteName,
  farmName,
  lotName,
  skuName,
}: UseFetchPostharvestTallyBySku): UseFetchPostharvestTallyBySkuReturn => {
  const {
    data: postharvestSkuTally,
    revalidate,
    isValidating: isLoading,
    error,
  } = useSwrAxios<PostharvestSkuTally>({
    url:
      siteName &&
      farmName &&
      lotName &&
      skuName &&
      `${GET_TALLY_BY_SKU}${toQueryParams({
        siteName,
        farmName,
        lotName,
        skuName,
      })}`,
  });

  useLogAxiosErrorInSnackbar(error);

  return {
    postharvestSkuTally,
    revalidate,
    isLoading,
  };
};
