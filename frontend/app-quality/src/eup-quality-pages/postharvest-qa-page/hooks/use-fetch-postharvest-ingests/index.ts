import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { toQueryParams } from '@plentyag/core/src/utils';
import { useCallback, useMemo } from 'react';

import { LIST_INGEST_URL } from '../../constants';
import { PostharvestIngest } from '../../types';
import { getPostharvestQaId } from '../../utils/get-postharvest-qa-id';

export interface UseFetchPostharvestIngests {
  siteName: string;
  farmName: string;
}
export interface UseFetchPostharvestIngestsReturn {
  postharvestIngestRecord: Record<string, PostharvestIngest>;
  postharvestIngests: PostharvestIngest[];
  revalidate: () => Promise<boolean>;
  getPostharvestIngestByLotAndSku: (obj: { sku: string; lot: string }) => PostharvestIngest;
  isLoading: boolean;
}

export const useFetchPostharvestIngests = ({
  siteName,
  farmName,
}: UseFetchPostharvestIngests): UseFetchPostharvestIngestsReturn => {
  const {
    data,
    revalidate,
    isValidating: isLoading,
    error,
  } = useSwrAxios<PaginatedList<PostharvestIngest>>({
    url:
      siteName &&
      farmName &&
      `${LIST_INGEST_URL}${toQueryParams({
        site: siteName,
        farm: farmName,
      })}`,
  });

  useLogAxiosErrorInSnackbar(error);

  const postharvestIngests = data?.data ?? [];

  // Create record index and collect all IDs by lot/sku
  const postharvestIngestRecord = useMemo(
    () =>
      postharvestIngests.reduce((acc, postharvestIngest) => {
        acc[getPostharvestQaId(postharvestIngest)] = postharvestIngest;
        return acc;
      }, {}),
    [postharvestIngests]
  );

  const getPostharvestIngestByLotAndSku = useCallback(
    (obj: { sku: string; lot: string }) => postharvestIngestRecord?.[getPostharvestQaId(obj)] || null,
    [postharvestIngestRecord]
  );

  return {
    postharvestIngestRecord,
    postharvestIngests,
    getPostharvestIngestByLotAndSku,
    revalidate,
    isLoading,
  };
};
