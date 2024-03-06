import { getYCoordBetweenTwoPoints } from './get-y-coord-between-two-points';

describe('getYCoordBetweenTwoPoints', () => {
  it('returns the X coordinate between two points based on a X coordinate', () => {
    expect(getYCoordBetweenTwoPoints({ x1: 1, y1: 1, x2: 10, y2: 10, mouseX: 5 })).toBe(5);
  });
});
