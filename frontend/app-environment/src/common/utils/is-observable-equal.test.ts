import { isObservableEqual } from '.';

const observable1 = { path: 'a', measurementType: 'a', observationName: 'a' };
const observable2 = { ...observable1 };
const observable3 = { ...observable1, observationName: 'b' };

describe('isObservableEqual', () => {
  it('returns true', () => {
    expect(isObservableEqual(observable1)(observable2)).toBe(true);
  });

  it('returns false', () => {
    expect(isObservableEqual(observable1)(observable3)).toBe(false);
  });
});
