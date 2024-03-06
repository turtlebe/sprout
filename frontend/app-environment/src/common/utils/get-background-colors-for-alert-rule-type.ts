import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { COLORS } from './constants';

export function getBackgroundColorsForAlertRuleType(alertRuleType: AlertRuleType): [string, string] {
  if (alertRuleType === AlertRuleType.specLimit) {
    return [COLORS.specLimit, '#ffffff'];
  }

  if (alertRuleType === AlertRuleType.specLimitDevices) {
    return [COLORS.specLimitDevices, '#ffffff'];
  }

  return [COLORS.controlLimit, '#ffffff'];
}
