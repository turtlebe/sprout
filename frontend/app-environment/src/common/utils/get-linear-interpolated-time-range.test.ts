import { Rule } from '@plentyag/core/src/types/environment';

import { getLinearInterpolatedRule } from './get-linear-interpolated-time-range';

const ruleA: Rule = {
  gte: 10,
  lte: 10,
  time: 3600,
};
const ruleB: Rule = {
  gte: 30,
  lte: 30,
  time: 3600 * 3,
};

describe('getLinearInterpolatedRule', () => {
  it('returns a Rule with interpolated gte, lte and time between two other Rules', () => {
    expect(getLinearInterpolatedRule(ruleA, ruleB, 3600 * 2)).toEqual({
      gte: 20,
      lte: 20,
      time: 3600 * 2,
    });

    expect(getLinearInterpolatedRule(ruleB, ruleA, 3600 * 2)).toEqual({
      gte: 20,
      lte: 20,
      time: 3600 * 2,
    });
  });

  it('returns a Rule without interpolated "gte"', () => {
    expect(getLinearInterpolatedRule({ ...ruleA, gte: null }, { ...ruleB, gte: null }, 3600 * 2)).toEqual({
      gte: null,
      lte: 20,
      time: 3600 * 2,
    });
  });

  it('returns a Rule without interpolated "lte"', () => {
    expect(getLinearInterpolatedRule({ ...ruleA, lte: null }, { ...ruleB, lte: null }, 3600 * 2)).toEqual({
      gte: 20,
      lte: null,
      time: 3600 * 2,
    });
  });
});
