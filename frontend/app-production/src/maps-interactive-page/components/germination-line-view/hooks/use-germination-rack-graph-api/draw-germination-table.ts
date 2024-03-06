import { conflictIconPath } from '@plentyag/app-production/src/maps-interactive-page/assets/draw-elements';
import * as d3 from 'd3';

interface DrawGerminationTable {
  el: d3.Selection<any, any, any, any>;
  x: number;
  y: number;
  width: number;
  height: number;
  skew: number;
  sideOffset: number;
  sideHeight: number;
  baseColor: string;
  tableOpacity: number;
  tableColor?: string;
  secondTableColor?: string;
  xColor?: string;
  toHighlight?: boolean;
  highlightStrokeColor?: string;
  highlightFillColor?: string;
  errorColor?: string;
  hasError?: boolean;
}

export const TABLE_SIDES_CLASS = 'germ-table-sides';
export const TABLE_TOP_CLASS = 'germ-table-top';
export const TABLE_SECOND_COLOR_CLASS = 'germ-table-second-color';
export const TABLE_HIGHLIGHT_CLASS = 'germ-table-highlight-top';
export const X_CLASS = 'germ-table-x-marker';
export const CONFLICT_CLASS = 'germ-table-conflict';
export const CONFLICT_ICON_CLASS = 'germ-table-conflict-icon';
export const INNER_PADDING = 0.1;

const dataTestIds = {
  triangle: 'draw-germination-table-triangle',
};
export { dataTestIds as dataTestIdsDrawGerminationTable };

export const drawGerminationTable = ({
  el,
  x,
  y,
  width,
  height,
  skew,
  sideOffset,
  sideHeight,
  baseColor,
  tableOpacity = 1,
  tableColor,
  secondTableColor,
  xColor,
  toHighlight,
  highlightStrokeColor,
  highlightFillColor,
  errorColor,
  hasError,
}: DrawGerminationTable): void => {
  // Draw surface
  const tableTopPath = d3.line()([
    [skew, 0],
    [width + skew, 0],
    [width, height],
    [0, height],
  ]);

  // Draw table sides
  const tableSidesPath = d3.line()([
    [0, height],
    [width, height],
    [width + skew, 0],
    [width + skew, sideHeight],
    [width, height + sideHeight],
    [0, height + sideHeight],
  ]);

  // Render the sides
  el.append('g')
    .attr('class', TABLE_SIDES_CLASS)
    .attr('transform', `translate(${x}, ${y + sideOffset})`)
    .append('path')
    .attr('d', `${tableSidesPath}Z`)
    .attr('fill', baseColor)
    .style('opacity', tableOpacity);

  // Render the table
  el.append('g')
    .attr('class', TABLE_TOP_CLASS)
    .attr('transform', `translate(${x}, ${y})`)
    .append('path')
    .attr('d', `${tableTopPath}Z`)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 1)
    .attr('stroke', baseColor)
    .attr('fill', tableColor ?? 'white')
    .style('opacity', tableOpacity);

  // Render the highlight
  const highlightTableTop = el
    .append('g')
    .attr('class', TABLE_HIGHLIGHT_CLASS)
    .attr('transform', `translate(${x}, ${y})`)
    .style('visibility', 'hidden');
  // -- draw the table top
  highlightTableTop
    .append('path')
    .attr('d', `${tableTopPath}Z`)
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

  // Draw "X" if no table color
  if (!tableColor && !hasError) {
    const slash1 = d3.line()([
      [skew + INNER_PADDING * width - INNER_PADDING * skew, height * INNER_PADDING],
      [width - INNER_PADDING * width + INNER_PADDING * skew, height - height * INNER_PADDING],
    ]);
    const slash2 = d3.line()([
      [INNER_PADDING * width + INNER_PADDING * skew, height - height * INNER_PADDING],
      [skew + width - INNER_PADDING * width - INNER_PADDING * skew, height * INNER_PADDING],
    ]);

    const xMarker = el.append('g').attr('class', X_CLASS).attr('transform', `translate(${x}, ${y})`);
    xMarker
      .append('path')
      .attr('d', `${slash1}Z`)
      .attr('stroke', xColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');
    xMarker
      .append('path')
      .attr('d', `${slash2}Z`)
      .attr('stroke', xColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');
  }

  if (hasError) {
    // Draw inner box
    const innerTableTop = d3.line()([
      [skew + INNER_PADDING * width - INNER_PADDING * skew, height * INNER_PADDING],
      [INNER_PADDING * width + INNER_PADDING * skew, height - height * INNER_PADDING],
      [width - INNER_PADDING * width + INNER_PADDING * skew, height - height * INNER_PADDING],
      [skew + width - INNER_PADDING * width - INNER_PADDING * skew, height * INNER_PADDING],
    ]);

    // Top surface
    const conflictTop = el.append('g').attr('class', CONFLICT_CLASS).attr('transform', `translate(${x}, ${y})`);
    conflictTop.append('path').attr('d', `${innerTableTop}Z`).attr('fill', baseColor);

    // Icon
    const iconSize = 24;
    const iconX = (width + skew) / 2 - iconSize / 2;
    const iconY = height / 2 - iconSize / 2;
    const conflictIcon = conflictTop
      .append('g')
      .classed(CONFLICT_ICON_CLASS, true)
      .attr('transform', `translate(${iconX}, ${iconY})`);
    conflictIcon.append('path').attr('d', conflictIconPath).attr('fill', errorColor).style('opacity', tableOpacity);
  }

  if (secondTableColor) {
    const lowerRightTriangle = d3.line()([
      [0, height],
      [width, height],
      [width + skew, 0],
    ]);

    el.append('g')
      .attr('class', TABLE_SECOND_COLOR_CLASS)
      .attr('data-testid', dataTestIds.triangle)
      .attr('transform', `translate(${x}, ${y})`)
      .append('path')
      .attr('d', `${lowerRightTriangle}Z`)
      .attr('fill', secondTableColor)
      .style('opacity', tableOpacity);
  }
};
