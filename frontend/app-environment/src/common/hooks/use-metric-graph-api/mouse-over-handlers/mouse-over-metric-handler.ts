import { getYCoordBetweenTwoPoints } from '@plentyag/app-environment/src/common/utils';
import { invertValue } from '@plentyag/app-environment/src/common/utils/d3';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import { getLastPathSegmentFromStringPath } from '@plentyag/core/src/utils';
import * as d3 from 'd3';
import moment from 'moment';
import { titleCase } from 'voca';

import { MouseOverHandler } from '.';

export interface MouseOverMetricHandler extends MouseOverHandler<RolledUpByTimeObservation> {
  circleSelector: string;
  metric?: Metric;
  remainingPath?: string;
  timeSummarization: TimeSummarization;
  tooltipSelector: string;
}

export function mouseOverMetricHandler({
  bisect,
  circleSelector,
  data,
  metric,
  mouseX,
  remainingPath,
  svg,
  timeSummarization,
  tooltip,
  tooltipSelector,
  unitSymbol,
  x,
  y,
}: MouseOverMetricHandler) {
  const circle = d3.select(svg).select(`circle.${circleSelector}`);
  const metricTooltip = tooltip.select(`#${tooltipSelector}`);

  // Get the index in the data of where the mouse intersect
  const i = bisect.left(data, x.invert(mouseX));

  // With the index, get the points on the left and right of where the mouse intersects.
  const left = data[i - 1];
  const right = data[i];

  if (left && right) {
    const tooltipContentLabel = metric
      ? `${remainingPath ?? getLastPathSegmentFromStringPath(metric.path)} - ${metric.observationName} ${titleCase(
          timeSummarization
        )}`
      : titleCase(timeSummarization);

    if (left.noData || right.noData) {
      // No data detected, hide the circle that follows the mouse when hovering the data
      // and display `??` in the tooltip.
      circle.attr('visibility', 'hidden');
      tooltip.select(`#${tooltipSelector}`).text(`${tooltipContentLabel}: ??`);
    } else {
      // With the left and right points, calculate the Y coordinate where the mouse intersect.
      const coordY =
        timeSummarization === TimeSummarization.value
          ? y(left['value'])
          : getYCoordBetweenTwoPoints({
              mouseX,
              x1: x(moment(left.rolledUpAt).toDate()),
              y1: y(left[timeSummarization]),
              x2: x(moment(right.rolledUpAt).toDate()),
              y2: y(right[timeSummarization]),
            });

      // Update the circle's position based on the Mouse's X coordinate.
      circle.attr('visibility', 'visible').attr('transform', 'translate(' + mouseX + ',' + coordY + ')');

      // Update the Tooltip's content regarding the Observation value
      const tooltipContentValue =
        timeSummarization === TimeSummarization.value ? left['value'] : `${invertValue(y, coordY)} ${unitSymbol}`;
      metricTooltip.text(`${tooltipContentLabel}: ${tooltipContentValue}`);
    }
  } else {
    circle.attr('visibility', 'hidden');
    metricTooltip.text('');
  }
}
