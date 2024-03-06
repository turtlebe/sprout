import { getSlopeAndIntercept } from './get-slope-and-intercept';

describe('getSlopeAndIntercept', () => {
  it('returns the slope and the intercept', () => {
    expect(getSlopeAndIntercept({ x1: 1, y1: 1, x2: 2, y2: 2 })).toEqual({ m: 1, b: 0 });
  });
});
