import { Rule } from '@plentyag/core/src/types/environment';

export function getNonNumericalRuleOperator(rule: Rule) {
  if (rule.eq) {
    return 'Equals to';
  }

  if (rule.neq) {
    return 'Not Equals to';
  }

  if (rule._in) {
    return 'In';
  }

  if (rule.nin) {
    return 'Not in';
  }

  if (rule.contains) {
    return 'Contains';
  }

  if (rule.ncontains) {
    return 'Not contains';
  }

  return null;
}
