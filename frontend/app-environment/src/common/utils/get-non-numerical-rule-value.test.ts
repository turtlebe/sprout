import { Rule } from '@plentyag/core/src/types/environment';

import { getNonNumericalRuleValue } from '.';

const rule = { time: 0 } as unknown as Rule;

describe('getNonNumericalRuleValue', () => {
  it('returns "Equals to"', () => {
    expect(getNonNumericalRuleValue({ ...rule, eq: '*' })).toBe('*');
  });

  it('returns "Not Equals to"', () => {
    expect(getNonNumericalRuleValue({ ...rule, neq: '*' })).toBe('*');
  });

  it('returns "In"', () => {
    expect(getNonNumericalRuleValue({ ...rule, _in: ['A', 'B'] })).toBe('A, B');
  });

  it('returns "Not in"', () => {
    expect(getNonNumericalRuleValue({ ...rule, nin: ['A', 'B'] })).toBe('A, B');
  });

  it('returns "Contains"', () => {
    expect(getNonNumericalRuleValue({ ...rule, contains: '*' })).toBe('*');
  });

  it('returns "Not contains"', () => {
    expect(getNonNumericalRuleValue({ ...rule, ncontains: '*' })).toBe('*');
  });

  it('returns the specified default', () => {
    expect(getNonNumericalRuleValue(rule, { default: 'foobar' })).toBe('foobar');
  });
});
