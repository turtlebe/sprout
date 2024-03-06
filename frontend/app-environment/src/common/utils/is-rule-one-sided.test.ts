import { isRuleOneSided } from './is-rule-one-sided';

describe('isRuleOneSided', () => {
  it('returns true', () => {
    expect(isRuleOneSided({ time: 0, lte: 0 })).toBe(true);
    expect(isRuleOneSided({ time: 0, gte: 0 })).toBe(true);
    expect(isRuleOneSided({ time: 0, gte: NaN, lte: 10 })).toBe(true);
    expect(isRuleOneSided({ time: 0, gte: 0, lte: NaN })).toBe(true);
    expect(isRuleOneSided({ time: 0, gte: NaN, lte: NaN })).toBe(true);
  });

  it('returns false', () => {
    expect(isRuleOneSided({ time: 0, gte: 0, lte: 10 })).toBe(false);
  });
});
