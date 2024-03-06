import { isOverlapping } from './is-overlapping';

describe('isOverlapping', () => {
  it('returns true', () => {
    expect(
      isOverlapping(
        { rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 },
        { rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 }
      )
    ).toBe(true);
  });

  it('returns true', () => {
    expect(
      isOverlapping(
        { rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 },
        { rowStart: 1, colStart: 1, rowEnd: 3, colEnd: 3 }
      )
    ).toBe(true);
  });

  it('returns true', () => {
    expect(
      isOverlapping(
        { rowStart: 2, colStart: 1, rowEnd: 3, colEnd: 3 },
        { rowStart: 2, colStart: 2, rowEnd: 3, colEnd: 3 }
      )
    ).toBe(true);
  });

  it('returns false', () => {
    expect(
      isOverlapping(
        { rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 },
        { rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 }
      )
    ).toBe(false);
  });
  it('returns false', () => {
    expect(
      isOverlapping(
        { rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 3 },
        { rowStart: 2, colStart: 1, rowEnd: 3, colEnd: 2 }
      )
    ).toBe(false);
  });
});
