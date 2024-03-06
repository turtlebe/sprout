import { FarmDefSkuType, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';

import { hasSkuTypeClass } from '..';

/**
 * Returns true if "Brand" can be shown for given skuTypeName.
 * Product "Brand" is only displayed for sku package types that are "clamshell" or "case".
 */
export function canShowBrand(skuTypeName: string, skuTypes: FarmDefSkuType[]) {
  return hasSkuTypeClass(skuTypeName, skuTypes, [SkuTypeClasses.Clamshell, SkuTypeClasses.Case]);
}
