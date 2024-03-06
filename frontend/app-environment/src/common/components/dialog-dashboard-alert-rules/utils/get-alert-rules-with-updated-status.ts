import { AlertRule } from '@plentyag/core/src/types/environment';

// Returns an alert rules (delta) array, with the new alert rule status for the item if the status changed from the original
export function getAlertRulesWithUpdatedStatus(originalAlertRules: AlertRule[], modifiedAlertRules: AlertRule[]) {
  return originalAlertRules
    .map(alertRule => {
      const updatedAlertRule = modifiedAlertRules.find(
        a => a.id === alertRule.id && (a.isEnabled !== alertRule.isEnabled || a.snoozedUntil !== alertRule.snoozedUntil)
      );
      return updatedAlertRule || false;
    })
    .filter(Boolean);
}
