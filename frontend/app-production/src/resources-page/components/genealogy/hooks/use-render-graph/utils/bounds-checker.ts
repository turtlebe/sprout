/**
 * Returns true if given x,y point is within the given rectange (viewBounds)
 * @param viewBounds
 * @param x
 * @param y
 */
export function isPointWithinViewBounds(viewBounds: ProdResources.ViewBounds, x: number, y: number): boolean {
  return (
    !!viewBounds &&
    x >= viewBounds.upperLeftX &&
    x <= viewBounds.lowerRightX &&
    y >= viewBounds.upperLeftY &&
    y <= viewBounds.lowerRightY
  );
}

/**
 * Returns true if given segment defined by (x1,y1) -> (x2,y2), intersects with viewBounds (rectange).
 * Note: the segment given here is either horizontal or vertical. So this function only handles this
 * subcase for intersection checking.
 * @param viewBounds The rectangular area that defines the bounds of the current graph view.
 * @param x1 First X point in segment.
 * @param y1 First Y point in segment.
 * @param x2 Second X point in segment.
 * @param y2 Second y point in segment.
 */
export function doesSegmentIntersectWithViewBounds({
  viewBounds,
  x1,
  y1,
  x2,
  y2,
}: {
  viewBounds: ProdResources.ViewBounds;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}): boolean {
  if (!viewBounds) {
    return false;
  }

  const doesVerticalSegmentIntersectRect =
    x1 >= viewBounds.upperLeftX &&
    x1 <= viewBounds.lowerRightX &&
    ((y1 <= viewBounds.lowerRightY && y2 >= viewBounds.upperLeftY) ||
      (y2 <= viewBounds.lowerRightY && y1 >= viewBounds.upperLeftY));

  const doesHorizontalzonalSegmentIntersectRect =
    y1 >= viewBounds.upperLeftY &&
    y1 <= viewBounds.lowerRightY &&
    ((x1 <= viewBounds.lowerRightX && x2 >= viewBounds.upperLeftX) ||
      (x2 <= viewBounds.lowerRightX && x1 >= viewBounds.upperLeftX));

  return doesVerticalSegmentIntersectRect || doesHorizontalzonalSegmentIntersectRect;
}
