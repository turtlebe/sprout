import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { getPrettyDate } from '../../utils';

import { renderFixedLengthLine } from './render-fixed-length-line';
import { addTooltip, performSearchOnNewestState, removeTooltip } from './utils';

const animateLineWidth = (line: ProdResources.Selection<any>, strokeWidth: number) => {
  return line.transition().duration(250).attr('stroke-width', strokeWidth);
};

interface RenderEllipsisLine {
  resource: ProdResources.BaseResource<ProdResources.Operation>;
  search: SearchActions['search'];
  ellipsisStartDate: Date;
  ellipsisDirection: 'forward' | 'backward';
  yIndex: number;
  numberOfOperationsNotShown: number;
  operationNotShown?: ProdResources.Operation;
  isStillAlive?: boolean;
  hasAntecedentOrSubsequents?: boolean;
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
  color: string;
}

/**
 * Renders state about resource and operations continuing in the given direction.
 * Renders dashed line used to indicate some operations are not dislayed
 * because there are too many operations to display all of them.
 * Optionally renders a marker at the end of the line to indicate:
 * 1. arrow if resource is still alive.
 * 2. bracket to indicate the resource has subsequents or antecedents.
 * 3. both 1 and 2.
 * @param resource The resource (anteedent, subsequent, parent or focused resource).
 * @param search Search function to call when ellipsis is clicked.
 * @param ellipsisStartDate Date where the ellipsis should start rendering.
 * @param ellipsisDirection The direction to render the ellipsis: forward or backward in time.
 * @param yIndex The y index in the graph to render the line.
 * @param numberOfOperationsNotShown The total number of operations that are not displayed.
 * @param operationNotShown The farther away (in time) operation not displayed.
 * @param isStillAlive True if the resource material has not died - this means further operations are possible.
 * @param hasAntecedentOrSubsequents True if resource has antecedents or subsequents.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export function renderOperationEllipsisLine({
  resource,
  search,
  ellipsisStartDate,
  ellipsisDirection,
  yIndex,
  numberOfOperationsNotShown,
  operationNotShown,
  isStillAlive,
  hasAntecedentOrSubsequents,
  svg,
  scale,
  viewBounds,
  color,
}: RenderEllipsisLine) {
  if (!isStillAlive && numberOfOperationsNotShown === 0 && !hasAntecedentOrSubsequents) {
    return;
  }

  let endMarker = undefined;
  if (isStillAlive && hasAntecedentOrSubsequents) {
    endMarker = 'arrow-with-bracket';
  } else if (isStillAlive) {
    endMarker = 'arrow';
  } else if (hasAntecedentOrSubsequents) {
    endMarker = 'bracket';
  }

  if (endMarker) {
    endMarker += `-${color}`;
  }

  const ellipsisLength = ellipsisDirection === 'forward' ? 30 : -30;

  const pathAttributes = {
    stroke: color,
    fill: color,
    showEndMarker: true,
    strokeWidth: 2.0,
    strokeDashArray: numberOfOperationsNotShown > 0 ? '2' : undefined,
    endMarker,
  };

  const line = renderFixedLengthLine({
    lineStart: ellipsisStartDate,
    lineLength: ellipsisLength,
    yIndex,
    pathAttributes,
    svg,
    scale,
    viewBounds,
  });

  if (!line) {
    return;
  }

  const transparentLine = renderFixedLengthLine({
    lineStart: ellipsisStartDate,
    lineLength: ellipsisLength * 2,
    yIndex,
    pathAttributes: {
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 8,
    },
    svg,
    scale,
    viewBounds,
  });

  if (!transparentLine) {
    return;
  }

  transparentLine
    .on('click', () => {
      performSearchOnNewestState(resource, search);
      removeTooltip();
    })
    .on('mouseenter', () => {
      animateLineWidth(line, pathAttributes.strokeWidth * 2)
        .on('end', () => {
          const toolTipContent = (
            <>
              {isStillAlive && <Typography>Resource is still alive.</Typography>}
              {!isStillAlive && operationNotShown && (
                <Typography>
                  Resource {ellipsisDirection === 'backward' ? 'born' : 'died'} at{' '}
                  {getPrettyDate(operationNotShown.endDt)}
                </Typography>
              )}
              {numberOfOperationsNotShown > 0 && (
                <Typography>{numberOfOperationsNotShown} operations not displayed.</Typography>
              )}
              {hasAntecedentOrSubsequents && (
                <Typography>Has {ellipsisDirection === 'backward' ? 'antecedents.' : 'subsequents.'}</Typography>
              )}
              {operationNotShown && (
                <>
                  <Typography>{ellipsisDirection === 'backward' ? 'Oldest' : 'Newest'} operation:</Typography>
                  <Typography variant="caption">{operationNotShown.type}</Typography>
                  <br />
                  <Typography variant="caption">{getPrettyDate(operationNotShown.endDt)}</Typography>
                </>
              )}
            </>
          );
          addTooltip(line.node(), toolTipContent);
        })
        .on('interrupt', removeTooltip);
    })
    .on('mouseleave', () => {
      animateLineWidth(line, pathAttributes.strokeWidth).on('end', removeTooltip);
    });
}
