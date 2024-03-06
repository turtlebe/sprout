import { AlertRuleType, Metric } from '@plentyag/core/src/types/environment';

export function hasAllAlertRules(metric: Metric) {
  const alertRuleTypesCreated = metric.alertRules.map(alertRule => alertRule.alertRuleType);

  return (
    alertRuleTypesCreated.includes(AlertRuleType.specLimit) &&
    alertRuleTypesCreated.includes(AlertRuleType.specLimitDevices) &&
    alertRuleTypesCreated.includes(AlertRuleType.controlLimit)
  );
}
