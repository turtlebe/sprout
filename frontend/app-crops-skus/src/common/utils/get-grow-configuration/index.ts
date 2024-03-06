import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';

import { GrowConfigurationType } from '../../types';

export function getGrowConfiguration(crop: FarmDefCrop) {
  const isSeedable = crop.isSeedable;
  const hasChildCrops = crop.childCrops?.length > 0;
  if (isSeedable) {
    return hasChildCrops ? GrowConfigurationType.isBlendedAtSeedingMachine : GrowConfigurationType.isSeedableAlone;
  } else {
    return hasChildCrops
      ? GrowConfigurationType.isBlendedAtBlendingMachine
      : GrowConfigurationType.isNotSeededOrBlended;
  }
}
