import { FarmDefSkuType, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';

import { hasSkuTypeClass } from '..';

/**
 * Returns true if "ProductWeight" can be shown for given skuTypeName.
 * "ProductWeight" is only displayed for sku package types that are "clamShell", "bulk" or "case".
 * that is, currently all types all show product weight, maybe in future this will change, so keeping check for now.
 */
export function canShowProductWeight(skuTypeName: string, skuTypes: FarmDefSkuType[]) {
  return hasSkuTypeClass(skuTypeName, skuTypes, [SkuTypeClasses.Clamshell, SkuTypeClasses.Bulk, SkuTypeClasses.Case]);
}
