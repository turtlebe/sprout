/**
 * Takes a a list of crops and finds all related packaging lot crop codes,
 * following child to parent recursive relations in FarmDef crops settings and
 * allowed crops relations in FarmDef SKUs settings.
 * @param crops A list of crops to find all related packaging lot crop codes.
 * @param childToParentCropsMapping A map of child to list of possible parent crops.
 * @param allowedCropToPackagingLotCropCodesMapping A map of allowed crop to list of packaging lot crop codes.
 */
export function getRelatedPackagingLotCropCodes(
  crops: string[],
  childToParentCropsMapping: Map<string, string[]>,
  allowedCropToPackagingLotCropCodesMapping: Map<string, string[]>
) {
  const relatedPackagingLotCropCodes = [];
  const cropsToProcess = [...crops];
  const processedCrops = [];
  while (cropsToProcess.length) {
    const crop = cropsToProcess.pop();
    // break the loop if in the case of circular child-parent relations
    if (processedCrops.includes(crop)) {
      continue;
    }
    const possiblePackagingLotCropCodes = allowedCropToPackagingLotCropCodesMapping.get(crop);
    if (possiblePackagingLotCropCodes && Array.isArray(possiblePackagingLotCropCodes)) {
      relatedPackagingLotCropCodes.push(...possiblePackagingLotCropCodes);
    }
    const possibleParentCrops = childToParentCropsMapping.get(crop);
    if (possibleParentCrops && Array.isArray(possibleParentCrops)) {
      cropsToProcess.push(...possibleParentCrops);
    }
    processedCrops.push(crop);
  }

  return [...new Set(relatedPackagingLotCropCodes)].sort((a, b) => a.localeCompare(b));
}
