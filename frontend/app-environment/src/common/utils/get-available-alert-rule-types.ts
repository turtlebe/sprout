import { isNumericalMetric } from '@plentyag/app-environment/src/common/utils';
import { AlertRuleType, Metric } from '@plentyag/core/src/types/environment';

/**
 * For a given Metric and optionnally an AlertRule, return its available AlertRule types.
 * - A non-numerical Metric can only have Non-Numerical AlertRule type.
 * - A numerical Metric can have one of each AlertRuleType (spec limit, control limit, spec limit devices).
 *   - If the Alert Rule is passed, the function returns the type of the Alert Rule plus the remaining types.
 */
export function getAvailableAlertRuleTypes(metric: Metric): AlertRuleType[] {
  if (!metric) {
    return [];
  }

  if (!isNumericalMetric(metric)) {
    return [AlertRuleType.nonNumerical];
  }

  return [AlertRuleType.controlLimit, AlertRuleType.specLimit, AlertRuleType.specLimitDevices];
}
