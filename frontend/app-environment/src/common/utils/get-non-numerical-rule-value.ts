import { Rule } from '@plentyag/core/src/types/environment';

export const serializeArrayValue = (value: string) =>
  value
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);

export const deserializeArrayValue = (value: string[]) => value.join(', ');

export function getNonNumericalRuleValue(rule: Rule, options = { default: '--' }) {
  if (rule._in) {
    return deserializeArrayValue(rule._in);
  }
  if (rule.nin) {
    return deserializeArrayValue(rule.nin);
  }
  return rule.eq || rule.neq || rule.contains || rule.ncontains || options.default;
}
