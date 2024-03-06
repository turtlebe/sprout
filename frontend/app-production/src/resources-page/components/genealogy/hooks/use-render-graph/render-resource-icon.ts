import * as d3 from 'd3';

import { ResourceSvg } from '../../components/resource-icon';

import { isPointWithinViewBounds } from './utils';

interface RenderResourceIcon {
  operations: ProdResources.Operation[];
  yIndex: number;
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

const imageDimension = 12;
// offset so image is moved up and to the right.
const imageOffSet = imageDimension + 3;

const imageXScaleGenerator = (x: Date, xScale: ProdResources.XScale) => {
  return xScale(x) + imageOffSet;
};

const imageYScaleGenerator = (y: number, yScale: ProdResources.YScale) => {
  return yScale(y) - imageOffSet;
};

/**
 * Gets the resource type (container or material) from the operations.
 * The operations contain stateIn/StateOut which will contain the resource type.
 * @param operations The list of operations for a resource, sorted by operation "date" (oldest operation first).
 * @return The Resource type.
 */
function getResourceType(operations: ProdResources.Operation[]) {
  if (operations.length > 0 && operations[0].stateOut) {
    const stateOut = operations[0].stateOut;
    return stateOut.containerObj?.containerType || stateOut.materialObj?.materialType;
  }
}

export function renderResourceIcon({ operations, yIndex, svg, scale, viewBounds }: RenderResourceIcon) {
  const svgIcon = ResourceSvg(getResourceType(operations));

  if (!svgIcon && operations.length > 0) {
    return;
  }

  // place image next to oldest operation
  const iconXDate = new Date(operations[0].endDt);

  const newX = imageXScaleGenerator(iconXDate, scale.xScale);
  const newY = imageYScaleGenerator(yIndex, scale.yScale);
  if (isPointWithinViewBounds(viewBounds, newX, newY)) {
    svg
      .append('image')
      .attr('x', newX)
      .attr('y', newY)
      .attr('width', imageDimension)
      .attr('height', imageDimension)
      .attr('href', svgIcon);
  }
}
