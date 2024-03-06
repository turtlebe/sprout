import * as d3 from 'd3';

import { TableRowData } from '../../types';

import { RenderFunction } from '.';

export const ALPHA_CLASS = 'alpha';
export const NUMERIC_CLASS = 'numeric';

export interface RenderCoordinates {
  rows?: TableRowData[];
}

export const renderCoordinates: RenderFunction<RenderCoordinates> =
  ({ svgRef, scale }) =>
  ({ rows }) => {
    // No DOM ref? get outta here!
    if (!svgRef.current) {
      return;
    }

    // Scale metadata
    const { xScale, yScale, paddingX, paddingY } = scale;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    // Alpha coordinates
    svgChartEl
      .append('g')
      .selectAll(`.${ALPHA_CLASS}`)
      .data(rows)
      .enter()
      .append('text')
      .attr('class', ALPHA_CLASS)
      .attr('dominant-baseline', 'middle')
      .attr('x', 0)
      .attr('y', (_, rowIndex) => yScale(rowIndex) + paddingY + yScale(1) / 2)
      .attr('fill', '#9A9A9A')
      .text(row => row.rowName);

    // Numeric coordinates
    const [firstRow] = rows;
    const columns = firstRow.resources;
    svgChartEl
      .append('g')
      .selectAll(`.${NUMERIC_CLASS}`)
      .data(columns)
      .enter()
      .append('text')
      .attr('class', NUMERIC_CLASS)
      .attr('dominant-baseline', 'bottom')
      .attr('text-anchor', 'middle')
      .attr('x', (_, columnIndex) => xScale(columnIndex) + paddingX + xScale(1) / 2)
      .attr('y', yScale(rows.length) + paddingY * 2)
      .attr('fill', '#9A9A9A')
      .text((_, columnIndex) => columnIndex + 1);
  };
