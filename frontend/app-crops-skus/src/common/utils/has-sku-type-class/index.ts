import { FarmDefSkuType, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';

import { getSkuTypeFromSkuTypeName } from '..';

/**
 * Returns true if given "skuTypeName" exists in given skuTypes and that skuType
 * has one of the given skuTypeClasses.
 */
export function hasSkuTypeClass(skuTypeName: string, skuTypes: FarmDefSkuType[], skuTypeClasses: SkuTypeClasses[]) {
  const skuType = getSkuTypeFromSkuTypeName(skuTypes, skuTypeName);
  return skuType ? skuTypeClasses.includes(skuType.properties.class) : false;
}
