import { Rule } from '@plentyag/core/src/types/environment';
import { isNumber } from 'lodash';

/** Returns whether a rule is one sided, meaning it has only a `gte` or `lte` attribute. */
export function isRuleOneSided(rule: Rule<Date | number>) {
  return !isNumber(rule.gte) || !isNumber(rule.lte) || Number.isNaN(rule.gte) || Number.isNaN(rule.lte);
}
