import { formatNumericalValue } from '.';

describe('formatValue', () => {
  it('formats the value', () => {
    expect(formatNumericalValue(10)).toBe(10);
    expect(formatNumericalValue(10.045646654)).toBe('10.05');
  });

  it('formats the value with a symbol', () => {
    expect(formatNumericalValue(10, 'C')).toBe('10 C');
    expect(formatNumericalValue(10.045646654, 'C')).toBe('10.05 C');
  });
});
