import { CropWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';

/**
 * Returns the subset of crops that are seedable and associated with one of the given farms
 */
export function getAllowedCropNames(farms: string[], crops: CropWithFarmInfo[]) {
  return farms?.length > 0
    ? crops
        .filter(crop => {
          const farmsAssociatedWithCrop = crop.hasFarm
            ? Object.keys(crop.hasFarm).filter(farm => crop.hasFarm[farm])
            : [];
          return (
            crop.isSeedable &&
            farmsAssociatedWithCrop.some(farmAssociatedWithCrop => farms.includes(farmAssociatedWithCrop))
          );
        })
        .map(crops => crops.name)
    : [];
}
