import { GrowConfigurationType } from '@plentyag/app-crops-skus/src/common/types';

import { isSeedable } from '.';

describe('isSeedable', () => {
  it('returns true', () => {
    expect(isSeedable(GrowConfigurationType.isSeedableAlone)).toBe(true);
    expect(isSeedable(GrowConfigurationType.isBlendedAtSeedingMachine)).toBe(true);
  });

  it('returns false', () => {
    expect(isSeedable(GrowConfigurationType.isNotSeededOrBlended)).toBe(false);
    expect(isSeedable(GrowConfigurationType.isBlendedAtBlendingMachine)).toBe(false);
  });
});
