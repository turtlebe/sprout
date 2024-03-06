import { AlertRule } from '@plentyag/core/src/types/environment';
import { isNumber } from 'lodash';

import { getRuleAt } from './get-time-range-at';
import { isRuleOneSided } from './is-rule-one-sided';

export function isAlertRuleTriggered(alertRule: AlertRule, at: Date, observationValue: number | string) {
  if (!alertRule || !at || !isNumber(observationValue)) {
    return null;
  }

  const rule = getRuleAt(alertRule, at);

  if (!rule) {
    return null;
  }

  const { gte, lte } = rule;

  if (isRuleOneSided(rule)) {
    return isNumber(gte) ? observationValue < gte : observationValue > lte;
  }

  return observationValue < gte || observationValue > lte;
}

export function isAlertRuleTriggeredNonNumerical(alertRule: AlertRule, at: Date, observationValue: number | string) {
  if (!alertRule || !at || !observationValue) {
    return null;
  }

  const rule = getRuleAt(alertRule, at);

  if (rule.eq) {
    return rule.eq === observationValue.toString();
  }

  if (rule.neq) {
    return rule.neq !== observationValue.toString();
  }

  if (rule._in) {
    return rule._in.includes(observationValue.toString());
  }

  if (rule.nin) {
    return !rule.nin.includes(observationValue.toString());
  }

  if (rule.contains) {
    return rule.contains.includes(observationValue.toString());
  }

  if (rule.ncontains) {
    return !rule.ncontains.includes(observationValue.toString());
  }

  return null;
}
