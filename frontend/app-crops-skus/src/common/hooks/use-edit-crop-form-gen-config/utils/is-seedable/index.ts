import { GrowConfigurationType } from '@plentyag/app-crops-skus/src/common/types';

export function isSeedable(growConfiguration: GrowConfigurationType) {
  return (
    growConfiguration === GrowConfigurationType.isSeedableAlone ||
    growConfiguration === GrowConfigurationType.isBlendedAtSeedingMachine
  );
}
