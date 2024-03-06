import { GrowConfigurationType } from '@plentyag/app-crops-skus/src/common/types';

import { isBlended } from '.';

describe('isBlended', () => {
  it('returns false', () => {
    expect(isBlended(GrowConfigurationType.isSeedableAlone)).toBe(false);
    expect(isBlended(GrowConfigurationType.isNotSeededOrBlended)).toBe(false);
  });

  it('returns true', () => {
    expect(isBlended(GrowConfigurationType.isBlendedAtBlendingMachine)).toBe(true);
    expect(isBlended(GrowConfigurationType.isBlendedAtSeedingMachine)).toBe(true);
  });
});
