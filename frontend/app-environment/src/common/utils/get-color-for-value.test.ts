import { getColorForValue } from './get-color-for-value';

describe('getColorForValue', () => {
  it('returns a unique color for a given ID', () => {
    expect(getColorForValue('TEMPERATURE-value:1')).toBe('#46aed7');
    expect(getColorForValue('TEMPERATURE-value:1')).toBe('#46aed7');
    expect(getColorForValue('TEMPERATURE-value:2')).toBe('#d5532c');
  });
});
