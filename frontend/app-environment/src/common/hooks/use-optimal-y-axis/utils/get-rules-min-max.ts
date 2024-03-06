import { AlertRule, Metric } from '@plentyag/core/src/types/environment';

export function getRulesMinMax(metrics: Metric[] = [], alertRules: AlertRule[] = []) {
  const mins = [];
  const maxs = [];

  metrics.filter(Boolean).forEach(metric => {
    metric.alertRules.forEach(alertRule => {
      alertRule.rules.forEach(rule => {
        rule.gte && mins.push(rule.gte);
        rule.lte && maxs.push(rule.lte);
      });
    });
  });

  alertRules.filter(Boolean).forEach(alertRule => {
    alertRule.rules.forEach(rule => {
      rule.gte && mins.push(rule.gte);
      rule.lte && maxs.push(rule.lte);
    });
  });

  return {
    min: mins.length ? Math.min(...mins) : NaN,
    max: maxs.length ? Math.max(...maxs) : NaN,
  };
}
