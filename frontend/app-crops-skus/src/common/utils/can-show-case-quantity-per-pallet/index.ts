import { FarmDefSkuType, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';

import { hasSkuTypeClass } from '..';

/**
 * Returns true if "CaseQuantityPerPallet" can be shown for given skuTypeName.
 * "CaseQuantityPerPallet" is only displayed for sku package types that are "case".
 */
export function canShowCaseQuantityPerPallet(skuTypeName: string, skuTypes: FarmDefSkuType[]) {
  return hasSkuTypeClass(skuTypeName, skuTypes, [SkuTypeClasses.Case]);
}
