/**
 * Given two coordinates, we can calculate B (y-intercept) and M (slope of the line) so that we can apply a linear
 * expression to calculate other coordinates.
 */
export function getSlopeAndIntercept({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) {
  // Delta X
  const deltaX = x2 - x1;

  // Delta Y
  const deltaY = y2 - y1;

  // Calculate M
  const m = deltaY / deltaX;

  // Using some concrete coordinates we can resolve B. (B = Y - M * X)
  const b = y2 - m * x2;

  return {
    m,
    b,
  };
}
