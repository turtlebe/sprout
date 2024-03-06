import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { PackagingLot } from '@plentyag/core/src/types';
import { toQueryParams } from '@plentyag/core/src/utils';
import { uniq } from 'lodash';
import { useMemo } from 'react';

import { isValidPackagingLotSku } from '../../utils/is-valid-packaging-lot-sku';

export interface UseLoadSkusForPackagingLots {
  lots: PackagingLot[];
  includeDeleted?: boolean;
  skuTypeClass?: 'Case' | 'Clamshell' | 'Bulk';
}

export interface UseLoadSkusForPackagingLotsReturn {
  skus: FarmDefSku[];
  skusRecord: Record<string, FarmDefSku>;

  isLoading: boolean;
}

export const useLoadSkusForPackagingLots = ({
  lots,
  includeDeleted = false,
  skuTypeClass,
}: UseLoadSkusForPackagingLots): UseLoadSkusForPackagingLotsReturn => {
  const packagingLotCropCodes = lots?.length > 0 ? uniq(lots.map(lot => lot.product)) : [];

  const queryParams = toQueryParams(
    {
      includeDeleted,
      skuTypeClass,
      packagingLotCropCode: packagingLotCropCodes,
    },
    {
      doNotEncodeArray: true,
    }
  );

  const url =
    packagingLotCropCodes.length > 0 ? `/api/swagger/farm-def-service/skus-api/search-skus${queryParams}` : null;
  const {
    data: skus,
    error,
    isValidating,
  } = useSwrAxios<FarmDefSku[]>({
    url,
  });

  // Filtering the skus based on unique NSI
  const uniqueSkus = useMemo(
    () =>
      (skus || []).reduce((acc, sku) => {
        const dup = acc.find(accSku => sku.netsuiteItem === accSku.netsuiteItem);
        // if there's a dup, keep the current valid packaging lot sku, else replace with incoming sku
        if (dup) {
          acc[acc.indexOf(dup)] = isValidPackagingLotSku(dup) ? dup : sku;
        } else {
          acc.push(sku);
        }
        return acc;
      }, []),
    [skus]
  );

  useLogAxiosErrorInSnackbar(error);

  const skusRecord: Record<string, FarmDefSku> = useMemo(
    () =>
      (uniqueSkus || []).reduce((agg, sku) => {
        const { name } = sku;
        agg[name] = sku;
        return agg;
      }, {}),
    [uniqueSkus]
  );

  return { skus: uniqueSkus, skusRecord, isLoading: isValidating };
};
