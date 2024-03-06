import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { COLORS } from './constants';
import { getColorForAlertRuleType } from './get-color-for-alert-rule-type';

describe('getColorForAlertRuleType', () => {
  it('returns a color for SPEC_LIMIT', () => {
    expect(getColorForAlertRuleType(AlertRuleType.specLimit)).toBe(COLORS.specLimitStroke);
  });

  it('returns a color for SPEC_LIMIT_DEVICES', () => {
    expect(getColorForAlertRuleType(AlertRuleType.specLimitDevices)).toBe(COLORS.specLimitDevicesStroke);
  });

  it('returns a color for CONTROL_LIMIT', () => {
    expect(getColorForAlertRuleType(AlertRuleType.controlLimit)).toBe(COLORS.controlLimitStroke);
  });
});
