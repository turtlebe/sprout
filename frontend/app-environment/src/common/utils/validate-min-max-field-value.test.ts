import { validateMinMaxFieldValue } from './validate-min-max-field-value';

describe('validateMinMaxFieldValue', () => {
  it('returns inputValue when no minValue or maxValue are provided', () => {
    expect(validateMinMaxFieldValue('200')).toBe('200');
  });

  it('returns inputValue stripped of leading zeros (i.e. a number)', () => {
    expect(validateMinMaxFieldValue('050', 0, 100)).toBe('50');
  });

  it('returns inputValue when greater than minValue and lesser than maxValue', () => {
    expect(validateMinMaxFieldValue('50', 0, 100)).toBe('50');
  });

  it('returns maxValue when inputValue greater than maxValue', () => {
    expect(validateMinMaxFieldValue('120', 0, 100)).toBe('100');
  });

  it('returns minValue when inputValue lesser than minValue', () => {
    expect(validateMinMaxFieldValue('-10', 0, 100)).toBe('0');
  });
});
