import { getColorForAlertRuleType } from '@plentyag/app-environment/src/common/utils';
import { AlertRule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment, { Moment } from 'moment';

import { RenderFunction } from '.';

export interface DebugRenderAlertRuleInterval {
  alertRule: AlertRule;
}
/**
 * Debugging and drawing function that draws a vertical line at each interval starts.
 */
export const debugRenderAlertRuleInterval: RenderFunction<DebugRenderAlertRuleInterval> =
  ({ ref, scale }) =>
  ({ alertRule }) => {
    const { x, width, paddingX, startDateTime, endDateTime } = scale;

    const g = d3.select(ref.current).append('g').attr('transform', `translate(${paddingX}, 0)`);

    const repeatInterval = alertRule.repeatInterval;
    const secondsBetweenStartsAtAndEndDateTime = moment
      .duration(moment(endDateTime).diff(alertRule.startsAt))
      .as('seconds');
    const hasExtraInterval = secondsBetweenStartsAtAndEndDateTime % repeatInterval === 0 ? 0 : 1;
    const intervalCountInWindow = Math.floor(secondsBetweenStartsAtAndEndDateTime / repeatInterval) + hasExtraInterval;

    let counter = 0;
    const intervalStarts: Moment[] = [];

    do {
      intervalStarts.push(moment(alertRule.startsAt).add(alertRule.repeatInterval * counter, 'seconds'));
      counter += 1;
    } while (counter < intervalCountInWindow);

    const oneIntervalBeforeStartDateTime = moment(startDateTime).subtract(alertRule.repeatInterval, 'seconds');
    const oneIntervalAfterEndDateTime = moment(endDateTime).add(alertRule.repeatInterval, 'seconds');

    const filteredIntervalStarts = intervalStarts.filter(
      intervalStart =>
        intervalStart.isSameOrAfter(oneIntervalBeforeStartDateTime) &&
        intervalStart.isSameOrBefore(oneIntervalAfterEndDateTime)
    );

    g.selectAll('whatver')
      .data(filteredIntervalStarts)
      .enter()
      .append('line')
      .attr('stroke', getColorForAlertRuleType(alertRule.alertRuleType))
      .attr('stroke-dasharray', 9)
      .attr('x1', d => x(d.toDate()))
      .attr('x2', d => x(d.toDate()))
      .attr('y1', width)
      .attr('y2', 0);
  };
