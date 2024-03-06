import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';
import * as d3 from 'd3';
import React from 'react';

import { getOperationAttributes } from '../../utils';

import { OperationTooltip } from './components/operation-tooltip';
import { addTooltip, isPointWithinViewBounds, performSearchOnNewestState, removeTooltip } from './utils';

const animateCircleRadius = (element: HTMLElement, size: number) => {
  return d3.select(element).transition().duration(250).attr('r', size);
};

interface RenderResourceOperations {
  resource: ProdResources.BaseResource<ProdResources.Operation>;
  operations: ProdResources.Operation[];
  yIndex: number;
  search: SearchActions['search'];
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

interface CircleRange {
  startX: number; // left edge of circle: center minus radius.
  endX: number; // right edge of circle: center plus radius.
  cx: number;
  cy: number;
  size: number;
  color: string;
  operation: ProdResources.Operation;
}

/**
 * Given two ranges where r1 is less than r2, see if they overlap.
 * @param r1 Range1
 * @param r2 Range2
 */
function doRangesOverlap(r1: CircleRange, r2: CircleRange) {
  return r1.endX >= r2.startX;
}

/**
 * Renders the operations (circles) for a particular resource.
 * Ex: renderers the four opX circles.
 *   op1 ------ op2 ------ op3 ------ op4
 * @param resource The resource (anteedent, subsequent, parent or focused resource).
 * @param operations The list of operations for a resource.
 * @param yIndex The Y index in the graph at which the circles are all rendered.
 * @param search Search function to call when line segment is selected.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export const renderResourceOperations = ({
  resource,
  operations,
  yIndex,
  search,
  svg,
  scale,
  viewBounds,
}: RenderResourceOperations) => {
  // determine which circles are within the viewBounds.
  const operationsInView: CircleRange[] = [];
  operations.forEach(operation => {
    const cx = scale.xScale(new Date(operation.endDt));
    const cy = scale.yScale(yIndex);
    if (isPointWithinViewBounds(viewBounds, cx, cy)) {
      const operationAttributes = getOperationAttributes(operation);
      const size = operationAttributes.size;
      const color = operationAttributes.color;
      operationsInView.push({ startX: cx - size, endX: cx + size, cx, cy, size, color, operation });
    }
  });

  // if nothing to render then bail.
  if (operationsInView.length === 0) {
    return;
  }

  const g = svg.append('g');

  // for the all circles in view, determine if any overlap and only render single circle for overlapping items.
  let overlappingCircles: CircleRange[] = [];
  operationsInView.forEach((operationInView, index) => {
    // does current item overlap with next item? if so add to list and continue looking until found
    // item that doesn't overlap with next item.
    if (index < operationsInView.length - 1 && doRangesOverlap(operationInView, operationsInView[index + 1])) {
      overlappingCircles.push(operationInView);
      return;
    }

    // here we have either a single circle that doesn't overlap with anyone or a group of circles that overlap.
    const overlappingOperations: ProdResources.Operation[] = overlappingCircles.map(circle => circle.operation);
    overlappingOperations.push(operationInView.operation);

    const size = operationInView.size;
    const lastCircleCenter = operationInView.endX - size;
    const firstCircleCenter =
      overlappingCircles.length === 0 ? lastCircleCenter : overlappingCircles[0].startX + overlappingCircles[0].size;
    const centerBetweenCombinedCircles = (firstCircleCenter + lastCircleCenter) / 2;

    // draw the circle and add handlers
    const circle = g
      .append('circle')
      .attr('cx', centerBetweenCombinedCircles)
      .attr('cy', operationInView.cy)
      .attr('r', size)
      .attr('stroke', 'transparent')
      .attr('stroke-width', size * 2)
      .attr('fill', overlappingCircles.length > 0 ? 'url(#diagonalHatch)' : operationInView.color);

    circle
      .on('click', () => {
        performSearchOnNewestState(resource, search);
        removeTooltip();
      })
      .on('mouseenter', event => {
        const element = event.target;
        animateCircleRadius(element, size * 1.25)
          .on('end', () => addTooltip(element, <OperationTooltip operations={overlappingOperations} />))
          .on('interrupt', removeTooltip);
      })
      .on('mouseleave', event => {
        removeTooltip();
        animateCircleRadius(event.target, size);
      });

    overlappingCircles = [];
  });
};
