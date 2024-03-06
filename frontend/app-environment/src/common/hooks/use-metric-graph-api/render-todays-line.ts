import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import * as d3 from 'd3';
import moment from 'moment';

import { RenderFunction, UseMetricGraphApi } from '.';

export interface RenderTodaysLine {
  isEditing?: boolean;
}

export const renderTodaysLine: RenderFunction<RenderTodaysLine> =
  ({ ref, scale }: UseMetricGraphApi) =>
  ({ isEditing }) => {
    const { x, height, paddingX, paddingY, startDateTime } = scale;
    const now = isEditing
      ? moment().subtract(moment.duration(moment().diff(moment(startDateTime))).as('days'), 'days')
      : moment();
    const g = d3
      .select(ref.current)
      .append('g')
      .attr('class', 'today')
      .attr('clip-path', 'url("#frame")')
      .attr('transform', `translate(${paddingX}, ${paddingY})`);

    g.append('line')
      .attr('stroke', COLORS.today)
      .attr('stroke-dasharray', 3)
      .attr('x1', () => x(now))
      .attr('x2', () => x(now))
      .attr('y1', height - paddingY * 2)
      .attr('y2', 0);

    g.append('text')
      .attr('x', () => x(now) + 8)
      .attr('y', height - paddingY * 3)
      .attr('fill', COLORS.today)
      .attr('font-size', '12px')
      .text(now.format('MMM DD, hh:mmA'));
  };
