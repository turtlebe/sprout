import { getNumberFromEndOfString } from '.';

describe('getNumberFromEndOfString', () => {
  it('returns number at end of string', () => {
    expect(getNumberFromEndOfString('test123')).toBe(123);
    expect(getNumberFromEndOfString('123')).toBe(123);
    expect(getNumberFromEndOfString('0')).toBe(0);
  });

  it('returns 0 when no number found at end of string', () => {
    expect(getNumberFromEndOfString('abc')).toBe(0);
    expect(getNumberFromEndOfString('123abc')).toBe(0);
    expect(getNumberFromEndOfString('1a1b1c')).toBe(0);
    expect(getNumberFromEndOfString('')).toBe(0);
    expect(getNumberFromEndOfString(null)).toBe(0);
    expect(getNumberFromEndOfString(undefined)).toBe(0);
  });
});
