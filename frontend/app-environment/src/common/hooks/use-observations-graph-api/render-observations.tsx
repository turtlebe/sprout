import { formatNumericalValue } from '@plentyag/app-environment/src/common/utils';
import { COLORS, DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { drawContainer } from '@plentyag/app-environment/src/common/utils/d3';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import { RenderObservationsGraphFunction } from '.';

export interface RenderObservations {
  metric: Metric;
  observations: RolledUpByTimeObservation[];
  color?: string;
  timeSummarization?: string;
  unitSymbol: string;
}

export const renderObservations: RenderObservationsGraphFunction<RenderObservations> =
  ({ ref, scale }) =>
  ({ observations, color = COLORS.data, metric, timeSummarization = DEFAULT_TIME_SUMMARIZATION, unitSymbol }) => {
    const { x, y, paddingX, paddingY, width, height } = scale;

    d3.select(ref.current)
      .append('g')
      .attr('transform', `translate(${paddingX}, ${paddingY})`)
      .append('path')
      .datum(observations)
      .attr('class', ['observations', `metric_${metric.id}`].join(' '))
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line<RolledUpByTimeObservation>()
          .x(d => x(moment(d.rolledUpAt).toDate()))
          .y(d => y(d[timeSummarization]))
      );

    const focus = drawContainer({ svg: ref.current, class: 'focus', paddingX, paddingY, disableClipPath: true });

    const mouseCircle = focus.append('circle').attr('r', 3).attr('fill', color).style('display', 'none');
    const mouseLine = focus
      .append('line')
      .attr('stroke', '#a5a5a5')
      .attr('stroke-width', '0.5px')
      .style('display', 'none');
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('display', 'none')
      .style('position', 'absolute');
    const tooltipTime = tooltip.append('div');
    const tooltipValue = tooltip.append('div');

    const bisectObservation = d3.bisector<RolledUpByTimeObservation, Date>(o => moment(o.rolledUpAt).toDate());

    focus
      .append('rect')
      .attr('class', 'overlay')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function () {
        mouseCircle.style('display', null);
        mouseLine.style('display', null);
        tooltip.style('display', null);
      })
      .on('mouseout', function () {
        mouseCircle.style('display', 'none');
        mouseLine.style('display', 'none');
        tooltip.style('display', 'none');
      })
      .on('mousemove', function (event) {
        // Get Mouse's X coordinate
        const [mouseX] = d3.pointer(event);

        // Get its value on the scale.
        const x0 = x.invert(mouseX);

        // Get the index in the data of where the mouse intersect
        const i = bisectObservation.left(observations, x0);

        // With the index, get the points on the left and right of where the mouse intersects.
        const left = observations[i - 1];
        const right = observations[i];

        if (!left || !right) {
          return;
        }

        const point =
          moment.duration(moment(x0).diff(left.rolledUpAt)) > moment.duration(moment(right.rolledUpAt).diff(x0))
            ? right
            : left;

        const rolledUpAt = moment(point.rolledUpAt);
        const xRolledUpAt = x(rolledUpAt);
        mouseLine
          .attr('x1', xRolledUpAt)
          .attr('y1', 0)
          .attr('x2', xRolledUpAt)
          .attr('y2', height - paddingY * 2);
        mouseCircle.attr('transform', 'translate(' + xRolledUpAt + ',' + y(point[timeSummarization]) + ')');
        tooltip.style('top', `${event.pageY + 4}px`).style('left', `${event.pageX + 16}px`);
        tooltipTime.text(rolledUpAt.format('hh:mm A'));
        tooltipValue.text(formatNumericalValue(point[timeSummarization], unitSymbol));
      });
  };
