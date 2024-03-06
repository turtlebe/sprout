import { SkuWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';

export function getSkuProductWeight(skuName: string, skus: SkuWithFarmInfo[]) {
  const sku = skus?.find(sku => sku.name === skuName);
  return sku?.productWeightOz;
}
