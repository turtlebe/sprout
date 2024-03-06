import { noop } from '.';

describe('noop', () => {
  it('should not error out when default method assignment is noop', () => {
    // ARRANGE 1 -- control
    const sometMethod1 = (callback?) => {
      callback();
    };

    // ACT 1 & ASSERT 1
    expect(() => sometMethod1()).toThrow();

    // ARRANGE
    const sometMethod2 = (callback = noop) => {
      callback();
    };

    // ACT & ASSERT
    expect(() => sometMethod2()).not.toThrow();
  });
});
