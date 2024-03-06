import { AlertRule } from '@plentyag/core/src/types/environment';
import { groupBy } from 'lodash';

import { getAlertRuleTypeLabel } from './get-alert-rule-type-label';

/**
 * Given an array of AlertRules, return a summary of its types with optional count if more than 1.
 *
 * Example: Control Limits, Spec Limits (3)
 */
export function getAlertRuleTypeLabels(alertRules: AlertRule[]) {
  if (!alertRules || !alertRules.length) {
    return '';
  }

  const getCountLabel = array => (array.length > 1 ? ` (${array.length})` : '');

  return Object.entries(groupBy(alertRules.map(alertRule => getAlertRuleTypeLabel(alertRule.alertRuleType))))
    .map(([key, values]) => `${key}${getCountLabel(values)}`)
    .sort((a, b) => a.localeCompare(b))
    .join(', ');
}
