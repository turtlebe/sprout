interface ScreenCoordinate {
  x: number;
  y: number;
}

/**
 * Converts screen coordinates (aka, dom coordinates) to SVG coordinates.
 * https://stackoverflow.com/questions/22183727/how-do-you-convert-screen-coordinates-to-document-space-in-a-scaled-svg
 * @param svgNode SVG element to get the coordinates for.
 * @param screenCoord The Screen coordinate to convert.
 */
export function screenCoordsToSvg(svgNode: SVGSVGElement, screenCoord: ScreenCoordinate) {
  const pt = svgNode.createSVGPoint();
  pt.x = screenCoord.x;
  pt.y = screenCoord.y;
  const svgCoord = pt.matrixTransform(svgNode.getScreenCTM().inverse());
  return { x: svgCoord.x, y: svgCoord.y };
}
