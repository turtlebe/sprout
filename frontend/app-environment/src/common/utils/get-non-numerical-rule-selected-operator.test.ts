import { Rule } from '@plentyag/core/src/types/environment';

import { getNonNumericalRuleSelectedOperator } from '.';

const rule = { time: 0 } as unknown as Rule;

describe('getNonNumericalRuleSelectedOperator', () => {
  it('returns "eq" operator', () => {
    expect(getNonNumericalRuleSelectedOperator({ ...rule, eq: '*' })).toEqual('eq');
  });

  it('returns "neq" operator', () => {
    expect(getNonNumericalRuleSelectedOperator({ ...rule, neq: '*' })).toEqual('neq');
  });

  it('returns "in" operator', () => {
    expect(getNonNumericalRuleSelectedOperator({ ...rule, _in: ['*'] })).toEqual('_in');
  });

  it('returns "nin" operator', () => {
    expect(getNonNumericalRuleSelectedOperator({ ...rule, nin: ['*'] })).toEqual('nin');
  });

  it('returns "contains" operator', () => {
    expect(getNonNumericalRuleSelectedOperator({ ...rule, contains: '*' })).toEqual('contains');
  });

  it('returns "ncontains" operator', () => {
    expect(getNonNumericalRuleSelectedOperator({ ...rule, ncontains: '*' })).toEqual('ncontains');
  });

  it('returns null', () => {
    expect(getNonNumericalRuleSelectedOperator(rule)).toEqual(null);
  });
});
