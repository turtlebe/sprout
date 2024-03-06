import { doesSegmentIntersectWithViewBounds, isPointWithinViewBounds } from '.';

const viewBounds: ProdResources.ViewBounds = { upperLeftX: 0, upperLeftY: 0, lowerRightX: 100, lowerRightY: 100 };

describe('isPointWithinViewBounds', () => {
  it('returns false with undefined viewBounds', () => {
    expect(isPointWithinViewBounds(undefined, 1, 1)).toBe(false);
  });

  it('returns true when point is inside of viewBounds', () => {
    expect(isPointWithinViewBounds(viewBounds, 50, 50)).toBe(true);
  });

  it('returns true when point is on the viewBounds', () => {
    expect(isPointWithinViewBounds(viewBounds, 0, 0)).toBe(true);
  });

  it('returns false when point is outside the viewBounds', () => {
    expect(isPointWithinViewBounds(viewBounds, 101, 100)).toBe(false);
  });
});

describe('doesSegmentIntersectWithViewBounds', () => {
  it('returns false with undefined viewBounds', () => {
    expect(doesSegmentIntersectWithViewBounds({ viewBounds: undefined, x1: 0, y1: 0, x2: 1, y2: 1 })).toBe(false);
  });

  describe('returns true when segment is within view bounds', () => {
    it('case 1: segment is totally inside of rect', () => {
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 1, y1: 1, x2: 1, y2: 15 })).toBe(true); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 1, y1: 1, x2: 15, y2: 1 })).toBe(true); // horizontal
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 1, y1: 1, x2: 1, y2: 1 })).toBe(true); // single point
    });

    it('case 2: segment partially overlaps with rect', () => {
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 1, y1: -1, x2: 1, y2: 15 })).toBe(true); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 90, y1: 1, x2: 101, y2: 1 })).toBe(true); // horizontal
    });

    it('case 3: segment bisects rect', () => {
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 50, y1: -50, x2: 50, y2: 150 })).toBe(true); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: -50, y1: 50, x2: 159, y2: 50 })).toBe(true); // horizontal
    });

    it('case 4: segment just touches the rect', () => {
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 0, y1: -1, x2: 0, y2: 0 })).toBe(true); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: -1, y1: 0, x2: 0, y2: 0 })).toBe(true); // horizontal
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 100, y1: 100, x2: 100, y2: 100 })).toBe(true); // single point
    });
  });

  describe('returns false when segment is not within the view bounds', () => {
    it('case 1: segment is outside but inline with rect', () => {
      //
      //   ---
      //   |R|  -S--
      //   ---
      //
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 25, y1: 101, x2: 25, y2: 110 })).toBe(false); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 101, y1: 50, x2: 110, y2: 50 })).toBe(false); // horizontal
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 25, y1: 101, x2: 25, y2: 101 })).toBe(false); // single point
    });

    it('case 2: segment is outside and crosses over the rect', () => {
      //
      //         |
      //   ---   |
      //   |R|   S
      //   ---   |
      //         |
      //
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 110, y1: -1, x2: 110, y2: 110 })).toBe(false); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: -10, y1: 110, x2: 110, y2: 110 })).toBe(false); // horizontal
    });

    it('case 3: segment is outside and partially crosses over the rec', () => {
      //
      //   ---
      //   |R|   |
      //   ---   S
      //         |
      //
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: 110, y1: 50, x2: 110, y2: 110 })).toBe(false); // vertical
      expect(doesSegmentIntersectWithViewBounds({ viewBounds, x1: -10, y1: -10, x2: 50, y2: -10 })).toBe(false); // horizontal
    });
  });
});
