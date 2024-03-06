import { FarmDefSku } from '@plentyag/core/src/farm-def/types';

function cropMappingExists(map: Map<string, string[]>, key: string, value: string) {
  return map.get(key).includes(value);
}

/**
 * Create mapping of type "allowedCrop" -> ["packagingLotCropCode1", "packagingLotCropCode2"]
 * @param skus - list of FarmDef SKUs
 */
export function getAllowedCropToPackagingLotCropCodesMapping(skus: FarmDefSku[]) {
  const allowedCropToPackagingLotCropMap = new Map<string, string[]>();
  if (!skus.length) {
    return allowedCropToPackagingLotCropMap;
  }

  skus.forEach((sku: FarmDefSku) => {
    if (!sku.allowedCropNames.length) {
      return;
    }

    const packagingLotCrop = sku.packagingLotCropCode;

    sku.allowedCropNames.forEach(allowedCropName => {
      if (!allowedCropToPackagingLotCropMap.has(allowedCropName)) {
        allowedCropToPackagingLotCropMap.set(allowedCropName, [packagingLotCrop]);
      } else if (!cropMappingExists(allowedCropToPackagingLotCropMap, allowedCropName, packagingLotCrop)) {
        allowedCropToPackagingLotCropMap.get(allowedCropName).push(packagingLotCrop);
      }
    });
  });

  return allowedCropToPackagingLotCropMap;
}
