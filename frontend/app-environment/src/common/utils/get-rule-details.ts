import { AlertRule, Metric, Rule } from '@plentyag/core/src/types/environment';
import { isNumber } from 'lodash';

import { formatNumericalValue } from './format-numerical-value';
import { getNonNumericalRuleOperator } from './get-non-numerical-rule-operator';
import { getNonNumericalRuleValue } from './get-non-numerical-rule-value';
import { getRuleAt } from './get-time-range-at';
import { isNumericalMetric } from './is-numerical-metric';
import { isRuleOneSided } from './is-rule-one-sided';
export interface GetRuleDetails {
  metric: Metric;
  alertRule: AlertRule;
  at: Date;
  unitSymbol: string;
}

export function getNumericalRuleDetails(rule: Rule, unitSymbol: string, value = 'X') {
  if (isRuleOneSided(rule)) {
    return isNumber(rule.gte)
      ? `${formatNumericalValue(rule.gte, unitSymbol)} (min) >= ${value} (value)`
      : `${value} (value) <= ${formatNumericalValue(rule.lte, unitSymbol)} (max)`;
  }

  return `${formatNumericalValue(rule.gte, unitSymbol)} (min) >= ${value} (value) <= ${formatNumericalValue(
    rule.lte,
    unitSymbol
  )} (max)`;
}

export function getRuleDetails({ metric, alertRule, at, unitSymbol }: GetRuleDetails) {
  const rule = getRuleAt(alertRule, at);

  if (!rule) {
    return '';
  }

  if (isNumericalMetric(metric)) {
    return getNumericalRuleDetails(rule, unitSymbol);
  }

  return `${getNonNumericalRuleOperator(rule)} ${getNonNumericalRuleValue(rule)}`;
}
