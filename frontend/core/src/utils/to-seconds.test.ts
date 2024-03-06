import { toSeconds } from './to-seconds';

describe('toSeconds', () => {
  it('returns undefined', () => {
    expect(toSeconds(null)).toBeUndefined();
    expect(toSeconds(undefined)).toBeUndefined();
  });

  it('returns 0', () => {
    expect(toSeconds(0)).toBe(0);
  });

  it('converts to minutes', () => {
    expect(toSeconds(1)).toBe(60);
    expect(toSeconds(2)).toBe(120);
  });
});
