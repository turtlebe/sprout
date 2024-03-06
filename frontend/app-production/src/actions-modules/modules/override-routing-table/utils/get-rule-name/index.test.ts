import { getRuleName } from '.';

describe('getRuleErrorName', () => {
  it('returns error name', () => {
    expect(getRuleName(3)).toEqual('rule_3');
  });
});
