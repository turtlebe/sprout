import { AlertRule, AlertRuleType } from '@plentyag/core/src/types/environment';

export function sortByAlertRuleType(a: AlertRule, b: AlertRule): number {
  if (a.alertRuleType === AlertRuleType.controlLimit && b.alertRuleType === AlertRuleType.specLimit) {
    return 1;
  }

  if (a.alertRuleType === AlertRuleType.controlLimit && b.alertRuleType === AlertRuleType.specLimitDevices) {
    return 1;
  }

  if (a.alertRuleType === AlertRuleType.specLimitDevices && b.alertRuleType === AlertRuleType.specLimit) {
    return 1;
  }

  return -1;
}
