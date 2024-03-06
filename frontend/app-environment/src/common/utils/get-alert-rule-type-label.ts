import { AlertRuleType } from '@plentyag/core/src/types/environment';

export function getAlertRuleTypeLabel(alertRuleType: AlertRuleType, truncated = false) {
  if (alertRuleType === AlertRuleType.specLimit) {
    return truncated ? 'SL' : 'Spec Limits';
  }

  if (alertRuleType === AlertRuleType.specLimitDevices) {
    return truncated ? 'SL (D.)' : 'Spec Limits (Devices)';
  }

  if (alertRuleType === AlertRuleType.controlLimit) {
    return truncated ? 'CL' : 'Control Limits';
  }

  if (alertRuleType === AlertRuleType.nonNumerical) {
    return truncated ? 'NNA' : 'Non Numerical Alert';
  }

  return alertRuleType;
}
