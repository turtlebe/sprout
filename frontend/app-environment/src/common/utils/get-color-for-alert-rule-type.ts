import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { COLORS } from './constants';

export function getColorForAlertRuleType(alertRuleType: AlertRuleType): string {
  if (alertRuleType === AlertRuleType.specLimit) {
    return COLORS.specLimitStroke;
  }

  if (alertRuleType === AlertRuleType.specLimitDevices) {
    return COLORS.specLimitDevicesStroke;
  }

  return COLORS.controlLimitStroke;
}
