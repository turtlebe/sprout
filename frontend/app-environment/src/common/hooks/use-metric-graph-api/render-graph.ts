import { colors } from '@plentyag/app-environment/src/common/utils';
import { PATTERNS_DATA } from '@plentyag/app-environment/src/common/utils/constants';
import { getAxisBottomTickFormat } from '@plentyag/app-environment/src/common/utils/d3';
import * as d3 from 'd3';
import { flatMap } from 'lodash';

import { RenderFunction } from '.';

export interface RenderGraph {
  unitSymbol: string;
  isEditing?: boolean;
  xTicks?: number;
  yTicks?: number;
}

export const renderGraph: RenderFunction<RenderGraph> =
  ({ ref, scale }) =>
  ({ unitSymbol, isEditing, xTicks, yTicks }) => {
    const { x, y, width, height, paddingX, paddingY, startDateTime } = scale;

    // Add patterns
    const svgPattern = d3.select(ref.current).append('defs').selectAll('pattern');

    svgPattern
      .data(PATTERNS_DATA)
      .enter()
      .append('pattern')
      .attr('id', d => d.name)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', d => `rotate(${d.rotate})`)
      .attr('height', d => d.width)
      .attr('width', d => d.width)
      .append('rect')
      .attr('height', d => d.width)
      .attr('width', d => d.width / 2)
      .attr('fill', d => d.color);

    const patterns = flatMap(
      colors.map(color => {
        return [
          { strokeWidth: 1, space: 5, rotate: -45, stroke: color[1], name: color[1] },
          { strokeWidth: 1, space: 5, rotate: 45, stroke: color[2], name: color[2] },
        ];
      })
    );

    // Add patterns
    svgPattern
      .data(patterns)
      .enter()
      .append('pattern')
      .attr('id', d => d.name)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', d => `rotate(${d.rotate})`)
      .attr('height', d => d.space)
      .attr('width', d => d.space)
      .append('line')
      .attr('y2', d => d.space)
      .attr('stroke', d => d.stroke)
      .attr('stroke-width', d => d.strokeWidth);

    // Draw a rectangular clip, later on, every shape drawn outside the rectangular won't be seen by the user.
    d3.select(ref.current)
      .select('defs')
      .append('clipPath')
      .attr('id', 'frame')
      .append('rect')
      .attr('width', width - paddingX * 2)
      .attr('height', height);

    // Draw X Axis
    d3.select(ref.current)
      .append('g')
      .attr('transform', `translate(${paddingX}, ${height - paddingY})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(xTicks)
          .tickFormat((d: Date) => getAxisBottomTickFormat(d, startDateTime, isEditing))
      );

    // Draw Y Axis
    d3.select(ref.current)
      .append('g')
      .attr('transform', `translate(${paddingX}, ${paddingY})`)
      .call(
        d3
          .axisLeft(y)
          .ticks(yTicks)
          .tickFormat(d => `${d} ${unitSymbol}`)
      );
  };
