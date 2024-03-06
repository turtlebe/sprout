import { FarmDefSkuType } from '@plentyag/core/src/farm-def/types';

export function getSkuTypeFromSkuTypeName(skuTypes: FarmDefSkuType[], skuTypeName: string) {
  return skuTypes.find(skuType => skuType.name === skuTypeName);
}
