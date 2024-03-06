import {
  isAlertRuleTriggered,
  isAlertRuleTriggeredNonNumerical,
  isNumericalMetric,
} from '@plentyag/app-environment/src/common/utils';
import { AlertRuleWithLiveStatus, LiveStatus, Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface useGetAlertRulesWithStatus {
  metric: Metric;
  endDateTime: Date;
  observationValue: number | string;
}

export interface UseGetAlertRulesWithStatusReturn {
  alertRules: AlertRuleWithLiveStatus[];
  metricStatus: LiveStatus;
}

export const useGetAlertRulesWithStatus = ({
  metric,
  endDateTime,
  observationValue,
}: useGetAlertRulesWithStatus): UseGetAlertRulesWithStatusReturn => {
  const isTriggered = isNumericalMetric(metric) ? isAlertRuleTriggered : isAlertRuleTriggeredNonNumerical;
  const alertRules = React.useMemo<AlertRuleWithLiveStatus[]>(
    () =>
      observationValue
        ? metric.alertRules
            .filter(alertRule => alertRule.rules.length > 0)
            .map(alertRule => ({
              ...alertRule,
              status: isTriggered(alertRule, endDateTime, observationValue)
                ? LiveStatus.outOfRange
                : LiveStatus.inRange,
            }))
            .sort(
              (a, b) =>
                Number(Boolean(b.status === LiveStatus.outOfRange)) -
                Number(Boolean(a.status === LiveStatus.outOfRange))
            )
        : [],
    [metric.alertRules, endDateTime, observationValue]
  );

  const metricStatus = React.useMemo(() => {
    if (!alertRules.length) {
      return LiveStatus.noData;
    }

    return observationValue
      ? alertRules.some(alertRule => alertRule.status === LiveStatus.outOfRange)
        ? LiveStatus.outOfRange
        : LiveStatus.inRange
      : LiveStatus.noData;
  }, [alertRules]);

  return { alertRules, metricStatus };
};
