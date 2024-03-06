import { AlertRule, LiveStatus, Metric } from '@plentyag/core/src/types/environment';

import { getRuleAt } from './get-time-range-at';
import { isAlertRuleTriggered, isAlertRuleTriggeredNonNumerical } from './is-alert-rule-triggered';
import { isNumericalMetric } from './is-numerical-metric';

export interface GetAlertRuleLiveStatus {
  metric: Metric;
  alertRule: AlertRule;
  at: Date;
  observationValue: number | string;
}

export function getAlertRuleLiveStatus({
  metric,
  alertRule,
  at,
  observationValue,
}: GetAlertRuleLiveStatus): LiveStatus {
  if (!alertRule || !at || !observationValue) {
    return LiveStatus.noData;
  }

  const rule = getRuleAt(alertRule, at);

  if (!rule) {
    return LiveStatus.noData;
  }

  const isTriggered = isNumericalMetric(metric) ? isAlertRuleTriggered : isAlertRuleTriggeredNonNumerical;

  return isTriggered(alertRule, at, observationValue) ? LiveStatus.outOfRange : LiveStatus.inRange;
}
