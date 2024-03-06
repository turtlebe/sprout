import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';

/**
 * Create mapping of type "childCrop" -> ["parentCrop1", "parentCrop2"]
 * @param crops - list of FarmDef Crops
 */
export function getChildToParentCropsMapping(crops: FarmDefCrop[]) {
  const componentCropToBlendedCropsMap = new Map<string, string[]>();
  if (!crops.length) {
    return componentCropToBlendedCropsMap;
  }

  crops.forEach((crop: FarmDefCrop) => {
    if (!crop.childCrops.length) {
      return;
    }

    crop.childCrops.forEach(childCrop => {
      if (!componentCropToBlendedCropsMap.has(childCrop.defaultCropName)) {
        componentCropToBlendedCropsMap.set(childCrop.defaultCropName, []);
      }
      componentCropToBlendedCropsMap.get(childCrop.defaultCropName).push(crop.name);
    });
  });

  return componentCropToBlendedCropsMap;
}
