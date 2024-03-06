import { FarmDefCrop, FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { siteToFarmPath, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

export function useCrops(site?: string): UseSwrAxiosReturn<FarmDefCrop[]> {
  const farmPath = site && siteToFarmPath(site);
  const url = farmPath && '/api/plentyservice/farm-def-service/search-crops-by-farm-path';
  return useSwrAxios<FarmDefCrop[]>(
    { url: site && url, params: { farm_path: farmPath } },
    { shouldRetryOnError: true }
  );
}

export function useSkus(site?: string): UseSwrAxiosReturn<FarmDefSku[]> {
  const farmPath = site && siteToFarmPath(site);
  const url = farmPath && '/api/plentyservice/farm-def-service/search-skus-by-farm-path';
  return useSwrAxios<FarmDefSku[]>({ url: site && url, params: { farm_path: farmPath } }, { shouldRetryOnError: true });
}
