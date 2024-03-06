import { conflictIconPath } from '@plentyag/app-production/src/maps-interactive-page/assets/draw-elements';
import propRackLiftSvg from '@plentyag/brand-ui/src/assets/svg/prop-rack-lift.svg';
import * as d3 from 'd3';

interface DrawPropagationTable {
  el: d3.Selection<any, any, any, any>;
  x: number;
  y: number;
  width: number;
  height: number;
  baseColor: string;
  tableOpacity: number;
  tableColor?: string;
  secondTableColor?: string;
  xColor?: string;
  showLift?: boolean;
  toHighlight?: boolean;
  highlightStrokeColor?: string;
  highlightFillColor?: string;
  errorColor?: string;
  hasError?: boolean;
}

export const CONFLICT_CLASS = 'prop-table-conflict';
export const CONFLICT_ICON_CLASS = 'prop-table-conflict-icon';
export const INNER_PADDING = 0.1;

const dataTestIds = {
  highlight: 'draw-propagation-table-highlight',
  liftIcon: 'draw-propagation-table-lift-icon',
  triangle: 'draw-propagation-table-triangle',
  xMarker: 'draw-propagation-table-x-marker',
};
export { dataTestIds as dataTestIdsDrawPropagationTable };

export const drawPropagationTable = ({
  el,
  x,
  y,
  width,
  height,
  baseColor,
  tableOpacity,
  tableColor,
  secondTableColor,
  xColor,
  showLift,
  toHighlight,
  highlightStrokeColor,
  highlightFillColor,
  errorColor,
  hasError,
}: DrawPropagationTable): void => {
  // Draw X
  const slash1 = d3.line()([
    [INNER_PADDING * width, height * INNER_PADDING],
    [width - INNER_PADDING * width, height - height * INNER_PADDING],
  ]);
  const slash2 = d3.line()([
    [INNER_PADDING * width, height - height * INNER_PADDING],
    [width - INNER_PADDING * width, height * INNER_PADDING],
  ]);

  // Render the table
  const table = el
    .append('g')
    .attr('transform', `translate(${x}, ${y})`)
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 3)
    .attr('stroke', baseColor)
    .attr('fill', tableColor ?? 'white');

  // Render the highlight
  const highlightTableTop = el
    .append('g')
    .attr('data-testid', dataTestIds.highlight)
    .attr('transform', `translate(${x}, ${y})`)
    .style('visibility', 'hidden');
  // -- draw the table top
  highlightTableTop
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .attr('stroke', highlightStrokeColor ?? baseColor)
    .attr('fill', highlightFillColor ?? tableColor ?? 'white');

  // Visual feedback on hover
  el.on('mouseenter.feedback', function (event) {
    event.preventDefault();
    highlightTableTop.style('visibility', 'visible');
  }).on('mouseleave.feedback', function (event) {
    event.preventDefault();
    highlightTableTop.style('visibility', 'hidden');
  });

  // Highlight on demand
  if (toHighlight) {
    highlightTableTop.style('visibility', 'visible');
  }

  if (!tableColor && !hasError) {
    // Draw "X"
    const xMarker = el.append('g').attr('data-testid', dataTestIds.xMarker).attr('transform', `translate(${x}, ${y})`);
    xMarker.append('path').attr('d', `${slash1}Z`).attr('stroke', xColor).attr('stroke-width', 2);
    xMarker.append('path').attr('d', `${slash2}Z`).attr('stroke', xColor).attr('stroke-width', 2);
  } else {
    table.style('opacity', tableOpacity);
  }

  if (hasError) {
    // Draw inner box
    const innerTableTop = d3.line()([
      [INNER_PADDING * width, height * INNER_PADDING],
      [INNER_PADDING * width, height - height * INNER_PADDING],
      [width - INNER_PADDING * width, height - height * INNER_PADDING],
      [width - INNER_PADDING * width, height * INNER_PADDING],
    ]);

    // Top surface
    const conflictTop = el.append('g').attr('class', CONFLICT_CLASS).attr('transform', `translate(${x}, ${y})`);
    conflictTop.append('path').attr('d', `${innerTableTop}Z`).attr('fill', baseColor);

    // Icon
    const iconSize = 24;
    const iconX = width / 2 - iconSize / 2;
    const iconY = height / 2 - iconSize / 2;
    const conflictIcon = conflictTop
      .append('g')
      .classed(CONFLICT_ICON_CLASS, true)
      .attr('transform', `translate(${iconX}, ${iconY})`);
    conflictIcon.append('path').attr('d', conflictIconPath).attr('fill', errorColor).style('opacity', tableOpacity);
  }

  if (secondTableColor) {
    const lowerRightTriangle = d3.line()([
      [width, 0],
      [width, height],
      [0, height],
    ]);

    el.append('g')
      .attr('data-testid', dataTestIds.triangle)
      .attr('transform', `translate(${x}, ${y})`)
      .append('path')
      .attr('d', `${lowerRightTriangle}Z`)
      .attr('fill', secondTableColor)
      .style('opacity', tableOpacity);
  }

  // optionally show the lift icon on top of the table.
  if (showLift) {
    el.append('g')
      .attr('data-testid', dataTestIds.liftIcon)
      .append('image')
      .attr('transform', `translate(${x + width / 2}, ${y - height / 2 + 2})`)
      .attr('href', propRackLiftSvg);
  }
};
