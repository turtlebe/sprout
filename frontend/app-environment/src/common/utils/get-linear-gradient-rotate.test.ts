import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { getLinearGradientRotate } from './get-linear-gradient-rotate';

describe('getLinearGradientRotate', () => {
  it('returns a rotate number for SPEC_LIMIT', () => {
    expect(getLinearGradientRotate(AlertRuleType.specLimit)).toBe(0 + 90);
  });

  it('returns a rotate number for SPEC_LIMIT_DEVICES', () => {
    expect(getLinearGradientRotate(AlertRuleType.specLimitDevices)).toBe(45 + 90);
  });

  it('returns a rotate number for CONTROL_LIMIT', () => {
    expect(getLinearGradientRotate(AlertRuleType.controlLimit)).toBe(90 + 90);
  });
});
