import { screenCoordsToSvg } from '../../../utils';

export function getViewBounds(svgNode: SVGSVGElement): ProdResources.ViewBounds {
  // note: don't use x/y from getBoundingClientRect, use left/top - as not available on old chrome versions.
  const svgBoundingRect = svgNode.getBoundingClientRect();

  const upperLeft = screenCoordsToSvg(svgNode, { x: svgBoundingRect.left, y: svgBoundingRect.top });
  const lowerRight = screenCoordsToSvg(svgNode, {
    x: svgBoundingRect.left + svgBoundingRect.width,
    y: svgBoundingRect.top + svgBoundingRect.height,
  });

  return { upperLeftX: upperLeft.x, upperLeftY: upperLeft.y, lowerRightX: lowerRight.x, lowerRightY: lowerRight.y };
}
