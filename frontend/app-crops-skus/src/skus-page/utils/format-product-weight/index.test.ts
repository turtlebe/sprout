import { formatProductWeight } from '.';

describe('formatProductWeight', () => {
  it('returns pounds and ounces', () => {
    expect(formatProductWeight(18)).toBe('1 lb 2 oz');
  });

  it('returns pounds', () => {
    expect(formatProductWeight(32)).toBe('2 lb');
  });

  it('returns ounces', () => {
    expect(formatProductWeight(14)).toBe('14 oz');
  });

  it('passing null or undefined returns empty string', () => {
    expect(formatProductWeight(undefined)).toBe('');
    expect(formatProductWeight(null)).toBe('');
  });

  it('passing argument as string return correct value', () => {
    // @ts-ignore
    expect(formatProductWeight('18')).toBe('1 lb 2 oz');
  });
});
