import { getYCoordBetweenTwoPoints } from '@plentyag/app-environment/src/common/utils';
import { MOUSE_OVER_EFFECT } from '@plentyag/app-environment/src/common/utils/constants';
import { invertValue } from '@plentyag/app-environment/src/common/utils/d3';
import { ActionDefinition } from '@plentyag/core/src/farm-def/types';
import { Action, InterpolationType, Schedule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { MouseOverHandler } from '.';

const { circles } = MOUSE_OVER_EFFECT;

export interface MouseOverScheduleHandler extends MouseOverHandler<Action<Date>> {
  actionDefinition: ActionDefinition;
  key: string;
  schedule: Schedule;
  remainingPath?: string;
}

export function mouseOverScheduleHandler({
  svg,
  actionDefinition,
  bisect,
  data,
  key,
  mouseX,
  schedule,
  tooltip,
  x,
  y,
  unitSymbol,
  remainingPath,
  graphTooltipSelectors,
}: MouseOverScheduleHandler) {
  const circle = d3.select(svg).select(`circle.${circles.schedule(schedule, key)}`);
  const scheduleHeaderTooltip = tooltip.select(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
  const scheduleTooltip = tooltip.select(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

  // calculate the index `i` where the x0 coordinate interesects.
  const i = bisect.left(data, x.invert(mouseX));

  // With the index, get the Action on the left and right of where the mouse intersects.
  const left = data[i - 1];
  const right = data[i];

  if (left && right) {
    // get values for single or multiple values Action.
    const leftValue = key ? left.values[key] : left.value;
    const rightValue = key ? right.values[key] : right.value;

    const isLinearInterpolation = schedule.interpolationType === InterpolationType.linear;

    // When linear interpolated, we need to calculate the Y coordinate between two Actions manually.
    const coordY = isLinearInterpolation
      ? getYCoordBetweenTwoPoints({
          mouseX,
          x1: x(left.time),
          y1: y(leftValue),
          x2: x(right.time),
          y2: y(rightValue),
        })
      : y(leftValue);
    // When linear interpolated, we use the invert otherwise we simply use the left value that interescted.
    const yValue = isLinearInterpolation ? invertValue(y, coordY) : leftValue;

    if (actionDefinition.graphable) {
      circle.attr('visibility', 'visible').attr('transform', 'translate(' + mouseX + ',' + coordY + ')');
    }

    // when `remainingPath` is used, this is the context of multiple schedules on one chart.
    if (remainingPath) {
      if (key) {
        scheduleHeaderTooltip.text(remainingPath);
        scheduleTooltip.text(`${key}: ${yValue} ${unitSymbol}`);
      } else {
        scheduleHeaderTooltip.text(`${remainingPath}: ${yValue} ${unitSymbol}`);
      }
    } else {
      // when `remainingPath` is not used, this is the context of a single schedule on one chart.
      scheduleTooltip.text(`Schedule${key ? ` (${key})` : ''}: ${yValue} ${unitSymbol}`);
    }
  } else {
    circle.attr('visibility', 'hidden');
    scheduleTooltip.text('');
    scheduleHeaderTooltip.text('');
  }
}
