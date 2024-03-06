import { GridEmptySlot } from '@plentyag/core/src/types/environment';

// Code inspired from https://www.geeksforgeeks.org/find-two-rectangles-overlap/ and adapted for CSS grids coordinates.
export function isOverlapping(a: GridEmptySlot, b: GridEmptySlot) {
  const l1 = { x: a.rowStart, y: a.colEnd };
  const r1 = { x: a.rowEnd, y: a.colStart };
  const l2 = { x: b.rowStart, y: b.colEnd };
  const r2 = { x: b.rowEnd, y: b.colStart };

  // if rectangle has area 0, no overlap
  if (l1.x == r1.x || l1.y == r1.y || r2.x == l2.x || l2.y == r2.y) {
    return false;
  }

  // If one rectangle is on left side of other
  if (l1.x >= r2.x || l2.x >= r1.x) {
    return false;
  }

  // If one rectangle is above other
  if (r1.y >= l2.y || r2.y >= l1.y) {
    return false;
  }

  return true;
}
