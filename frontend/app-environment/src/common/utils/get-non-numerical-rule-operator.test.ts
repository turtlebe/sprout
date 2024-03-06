import { Rule } from '@plentyag/core/src/types/environment';

import { getNonNumericalRuleOperator } from '.';

const rule = { time: 0 } as unknown as Rule;

describe('getNonNumericalRuleOperator', () => {
  it('returns "Equals to"', () => {
    expect(getNonNumericalRuleOperator({ ...rule, eq: '*' })).toEqual('Equals to');
  });

  it('returns "Not Equals to"', () => {
    expect(getNonNumericalRuleOperator({ ...rule, neq: '*' })).toEqual('Not Equals to');
  });

  it('returns "In"', () => {
    expect(getNonNumericalRuleOperator({ ...rule, _in: ['*'] })).toEqual('In');
  });

  it('returns "Not in"', () => {
    expect(getNonNumericalRuleOperator({ ...rule, nin: ['*'] })).toEqual('Not in');
  });

  it('returns "Contains"', () => {
    expect(getNonNumericalRuleOperator({ ...rule, contains: '*' })).toEqual('Contains');
  });

  it('returns "Not contains"', () => {
    expect(getNonNumericalRuleOperator({ ...rule, ncontains: '*' })).toEqual('Not contains');
  });

  it('returns null', () => {
    expect(getNonNumericalRuleOperator(rule)).toEqual(null);
  });
});
