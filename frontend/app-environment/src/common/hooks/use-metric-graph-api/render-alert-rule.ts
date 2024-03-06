import { AlertRule, Rule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { getRulesFromStartToEnd } from '../../utils';

import { RenderFunction } from '.';

export interface RenderAlertRule {
  alertRule: AlertRule;
  options?: {
    opacity?: number;
    pattern?: string;
    visibility?: string;
  };
}

export const renderAlertRule: RenderFunction<RenderAlertRule> =
  ({ ref, scale }) =>
  ({ alertRule, options }) => {
    if (!alertRule.rules || !alertRule.rules.length) {
      return;
    }

    const { x, y, paddingX, paddingY, startDateTime, endDateTime, minY, maxY } = scale;
    const { opacity = 1, pattern = alertRule.alertRuleType, visibility = 'visible' } = options ?? {};
    const data = getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y });

    // Draw Rule Area
    const gAlertRule = d3
      .select(ref.current)
      .append('g')
      .attr('class', ['alert-rule', `type_${alertRule.alertRuleType}`, `metric_${alertRule.metricId}`].join(' '))
      .attr('clip-path', 'url("#frame")')
      .attr('transform', `translate(${paddingX}, 0)`)
      .attr('visibility', visibility)
      .append('g')
      .attr('transform', `translate(0, ${paddingY})`);

    gAlertRule
      .append('path')
      .datum(data)
      .attr('fill', `url("#${pattern}")`)
      .attr('fill-opacity', opacity)
      .attr('class', `alert-rule-${alertRule.alertRuleType}`)
      .attr('stroke', 'none')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .area<Rule<Date>>()
          .x(d => x(d.time))
          .y0(d => y(d.gte ?? minY))
          .y1(d => y(d.lte ?? maxY))
      );
  };
