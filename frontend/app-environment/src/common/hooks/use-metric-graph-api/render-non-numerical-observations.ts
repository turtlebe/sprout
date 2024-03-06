import { DataTestIdsGraphTooltipNonNumerical } from '@plentyag/app-environment/src/common/components';
import { getColorForValue, getObservationsByTimeRange } from '@plentyag/app-environment/src/common/utils';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { ObservationsByTime, TimeGranularity, TooltipPositioning } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';

import { RenderFunction } from '.';

export interface RenderNonNumericalObservations {
  observations: RolledUpByTimeObservation[];
  timeGranularity: TimeGranularity;
  valueAttribute: string;
  onClick: (observationsByTime: ObservationsByTime) => void;
  tooltipPositioning?: TooltipPositioning;
  graphTooltipSelectors: DataTestIdsGraphTooltipNonNumerical;
}

export const renderNonNumericalObservations: RenderFunction<RenderNonNumericalObservations> =
  ({ ref, scale }) =>
  ({
    observations = [],
    timeGranularity,
    valueAttribute,
    onClick,
    tooltipPositioning = TooltipPositioning.default,
    graphTooltipSelectors,
  }) => {
    const { x, y, paddingX, paddingY } = scale;

    const valuesDomain = _.uniq(observations.map(o => o.value));
    const stack = d3
      .stack<ObservationsByTime>()
      .keys(valuesDomain)
      .value((d, key) => {
        return d.observations.find(o => o.value === key)?.valueCount ?? 0;
      });

    const tooltip = d3.select(`#${graphTooltipSelectors.root}`);

    const observationsGroupedByTime: ObservationsByTime[] = Object.entries(_.groupBy(observations, 'rolledUpAt')).map(
      item => ({ rolledUpAt: item[0], observations: item[1] })
    );
    const stackedData = stack(observationsGroupedByTime);

    d3.select(ref.current)
      .append('g')
      .attr('clip-path', 'url("#frame")')
      .attr('transform', `translate(${paddingX}, 0)`)
      .append('g')
      .attr('transform', `translate(0, ${paddingY})`)
      .attr('class', 'observation-histogram')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => getColorForValue(d.key))
      .attr('data-key', d => d.key)
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('cursor', 'pointer')
      .attr('padding', '1px')
      .attr('x', d => x(moment(d.data.rolledUpAt)))
      .attr(
        'width',
        d => x(moment(d.data.rolledUpAt).add(timeGranularity.value, 'minute')) - x(moment(d.data.rolledUpAt)) - 1
      )
      .attr('y', ([y1, y2]) => Math.min(y(y1), y(y2)))
      .attr('height', ([y1, y2]) => Math.abs(y(y1) - y(y2)))
      .on('mouseover', function (event, d) {
        const key = (this as Element).parentElement.getAttribute('data-key');
        // calculate width of the tooltip
        const tooltipDimension = document.querySelector(`#${graphTooltipSelectors.content}`).getBoundingClientRect();
        const svgDimension = d3.select(ref.current).node().getBoundingClientRect();
        // calculate position of tooltip depending on its width.
        const eventCoordX = tooltipPositioning === TooltipPositioning.grid ? 'offsetX' : 'pageX';
        const eventCoordY = tooltipPositioning === TooltipPositioning.grid ? 'offsetY' : 'pageY';
        const paddingX = tooltipPositioning === TooltipPositioning.grid ? 32 : 16;
        let left = event[eventCoordX] + paddingX;
        if (left + tooltipDimension.width > svgDimension.right) {
          left = event[eventCoordX] - paddingX - tooltipDimension.width;
        }

        tooltip.style('display', 'block');
        tooltip.style('top', `${event[eventCoordY] + 4}px`).style('left', `${left}px`);
        tooltip.select(`#${graphTooltipSelectors.time}`).text(getObservationsByTimeRange(d.data, timeGranularity));
        tooltip
          .select(`#${graphTooltipSelectors.content}`)
          .text(
            `\n\r${valueAttribute || 'Value'}: ${key}\n\rCount: ${
              d.data.observations.find(o => o.value === key).valueCount
            }`
          );
      })
      .on('mouseout', function () {
        tooltip.style('display', 'none');
      })
      .on('click', function (event, d) {
        onClick(d.data);
      });
  };
