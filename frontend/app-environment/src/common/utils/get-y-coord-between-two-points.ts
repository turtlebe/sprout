interface GetSlope {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

function getSlope({ x1, y1, x2, y2 }: GetSlope): number {
  return (y2 - y1) / (x2 - x1);
}

function getIntercept(m: number, x: number, y: number): number {
  return y - m * x;
}

export interface GetYCoordBetweenTwoPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mouseX: number;
}

/**
 * Given two points, we can draw a line. Returns the Y coordinate on this line for the given X coordinate.
 *
 * We can express a linear expression by y = m * x + b.
 * Where "m" is the slope and can be calculated via {@see getSlope}.
 * And "b" is the intercept and can be calculated vai {@see getIntercept}.
 *
 * Once we have the slope and the intercept. We can resolve Y given X.
 */
export function getYCoordBetweenTwoPoints({ x1, y1, x2, y2, mouseX }: GetYCoordBetweenTwoPoints): number {
  const m = getSlope({ x1, y1, x2, y2 });
  const b = getIntercept(m, x1, y1);

  return m * mouseX + b;
}
