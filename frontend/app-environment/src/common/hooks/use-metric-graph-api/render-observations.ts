import { COLORS, DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import { RenderFunction } from '.';

export interface RenderObservations {
  metric: Metric;
  observations: RolledUpByTimeObservation[];
  color?: string;
  timeSummarization?: TimeSummarization;
}

export const renderObservations: RenderFunction<RenderObservations> =
  ({ ref, scale }) =>
  ({ observations, color = COLORS.data, metric, timeSummarization = DEFAULT_TIME_SUMMARIZATION }) => {
    const { x, y, paddingX, paddingY } = scale;

    d3.select(ref.current)
      .append('g')
      .attr('clip-path', 'url("#frame")')
      .attr('transform', `translate(${paddingX}, 0)`)
      .append('g')
      .attr('transform', `translate(0, ${paddingY})`)
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
          .defined(d => !d.noData)
          .x(d => x(moment(d.rolledUpAt).toDate()))
          .y(d => y(d[timeSummarization]))
      );
  };
