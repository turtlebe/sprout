import { toMinutes } from './to-minutes';

describe('toMinutes', () => {
  it('returns undefined', () => {
    expect(toMinutes(null)).toBeUndefined();
    expect(toMinutes(undefined)).toBeUndefined();
  });

  it('returns 0', () => {
    expect(toMinutes(0)).toBe(0);
  });

  it('converts to minutes', () => {
    expect(toMinutes(60)).toBe(1);
    expect(toMinutes(120)).toBe(2);
  });
});
