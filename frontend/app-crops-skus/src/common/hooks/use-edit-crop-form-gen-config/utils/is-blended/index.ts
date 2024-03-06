import { GrowConfigurationType } from '@plentyag/app-crops-skus/src/common/types';

/**
 * Returns true if crop is blended at seeding (or blending) machine, otherwise returns false.
 */
export function isBlended(growConfiguration: GrowConfigurationType) {
  return (
    growConfiguration === GrowConfigurationType.isBlendedAtSeedingMachine ||
    growConfiguration === GrowConfigurationType.isBlendedAtBlendingMachine
  );
}
