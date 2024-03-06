import { Rule } from '@plentyag/core/src/types/environment';

export function getNonNumericalRuleSelectedOperator(rule: Rule) {
  return ['eq', 'neq', '_in', 'nin', 'contains', 'ncontains'].find(operator => rule && rule[operator]) || null;
}
