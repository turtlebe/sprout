import { nearestValue } from './nearest-value';

describe('nearestValue', () => {
  it('returns the closest item in the array', () => {
    expect(nearestValue([1, 5, 10, 15, 20], 2)).toBe(1);
    expect(nearestValue([1, 5, 10, 15, 20], 2)).toBe(1);
    expect(nearestValue([1, 5, 10, 15, 20], 4)).toBe(5);
    expect(nearestValue([1, 5, 10, 15, 20], 12)).toBe(10);
    expect(nearestValue([1, 5, 10, 15, 20], 13)).toBe(15);
  });

  it('returns null', () => {
    expect(nearestValue([], 13)).toBe(null);
  });
});
