import { formatNonNumericalValue } from './format-non-numerical-value';

describe('formatNonNumericalValue', () => {
  it('returns the value with its symbol', () => {
    expect(formatNonNumericalValue('15', 'C')).toBe('15 C');
  });

  it('returns the value value only', () => {
    expect(formatNonNumericalValue('15', undefined)).toBe('15');
  });
});
