import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { COLORS } from './constants';
import { getBackgroundColorsForAlertRuleType } from './get-background-colors-for-alert-rule-type';

describe('getBackgroundColorsForAlertRuleType', () => {
  it('returns backgroundColors for SPEC_LIMIT', () => {
    expect(getBackgroundColorsForAlertRuleType(AlertRuleType.specLimit)).toEqual([COLORS.specLimit, '#ffffff']);
  });

  it('returns backgroundColors for SPEC_LIMIT_DEVICES', () => {
    expect(getBackgroundColorsForAlertRuleType(AlertRuleType.specLimitDevices)).toEqual([
      COLORS.specLimitDevices,
      '#ffffff',
    ]);
  });

  it('returns backgroundColors for CONTROL_LIMIT', () => {
    expect(getBackgroundColorsForAlertRuleType(AlertRuleType.controlLimit)).toEqual([COLORS.controlLimit, '#ffffff']);
  });
});
