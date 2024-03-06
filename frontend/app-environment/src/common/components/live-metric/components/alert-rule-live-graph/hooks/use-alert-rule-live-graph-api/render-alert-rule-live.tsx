import { formatNumericalValue, getRuleAt, isRuleOneSided } from '@plentyag/app-environment/src/common/utils';
import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import { AlertRule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { RenderAlertRuleLiveGraphFunction } from '.';

/**
 * Sizing constants
 */
export const constants = {
  graph: { width: 284, height: 80, paddingX: 10, paddingY: 0, minY: 1, maxY: 80 },
  label: { aboveRangeOffset: 10, belowRangeOffset: 20 },
  observation: { symbol: { size: 150 }, yOffset: 10 },
  range: { symbol: { size: 100 }, strokeWidth: 3 },
};

export interface RenderAlertRuleLive {
  alertRule: AlertRule;
  at: Date;
  unitSymbol: string;
  color: string;
  observationValue: number;
}

/**
 * D3 Graph that renders the current condition of the Metric with its AlertRule.
 *
 * It displays a range for each alert rule and an indicator where the given obseration fits on the range.
 */
export const renderAlertRuleLive: RenderAlertRuleLiveGraphFunction<RenderAlertRuleLive> =
  ({ ref, scale }) =>
  ({ alertRule, observationValue, unitSymbol, at, color: dataColor = COLORS.data }) => {
    const { paddingX, paddingY, height } = constants.graph;
    const { x, y, min, max, alertRuleMin, alertRuleMax } = scale;
    const lineY = height / 2;

    // Main container
    const g = d3.select(ref.current).append('g').attr('transform', `translate(${paddingX}, ${paddingY})`);

    /**
     * Render a Range with a line and two dots at each extremity of the line.
     */
    function renderRange(min: number, max: number, color: string) {
      g.append('line')
        .attr('stroke', color)
        .attr('stroke-width', constants.range.strokeWidth)
        .attr('x1', x(min))
        .attr('x2', x(max))
        .attr('y1', y(lineY))
        .attr('y2', y(lineY));

      g.append('path')
        .attr('d', d3.symbol().type(d3.symbolCircle).size(constants.range.symbol.size))
        .attr('fill', color)
        .attr('transform', `translate(${x(min)}, ${y(lineY)})`);

      g.append('path')
        .attr('d', d3.symbol().type(d3.symbolCircle).size(constants.range.symbol.size))
        .attr('fill', color)
        .attr('transform', `translate(${x(max)}, ${y(lineY)})`);
    }

    /**
     * Render a label.
     */
    function renderLabel(value: number) {
      return g
        .append('text')
        .attr('x', x(value))
        .attr('y', y(lineY) + constants.label.belowRangeOffset)
        .attr('font-size', '14px')
        .attr('fill', COLORS.liveMetricRange)
        .text(formatNumericalValue(value, unitSymbol));
    }

    const rule = getRuleAt(alertRule, at);

    if (!rule || isRuleOneSided(rule)) {
      return;
    }

    // Render a Range for the min/max.
    renderRange(min, max, COLORS.liveMetricRangeBackground);

    // Render a Range for the AlertRule.
    renderRange(rule.gte, rule.lte, COLORS.liveMetricRange);

    // Render a triangle symbol pointing down (arrow) indicating where the value fits on the AlertRules' Ranges.
    if (observationValue) {
      g.append('path')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(constants.observation.symbol.size))
        .attr('fill', dataColor)
        .attr(
          'transform',
          `translate(${x(observationValue)}, ${y(lineY) - constants.observation.yOffset}) rotate(180)`
        );
    }

    // Render a label for the min value of the AlertRule.
    const labelMin = renderLabel(alertRuleMin);

    // Render a label for the max value of the AlertRule.
    const labelMax = renderLabel(alertRuleMax);
    if (!observationValue || observationValue <= alertRuleMax) {
      labelMax.style('text-anchor', 'end');
    }

    // If the label max overlaps with the label min, show one on each side of the range.
    if (labelMin.node().getBoundingClientRect().right >= labelMax.node().getBoundingClientRect().left) {
      labelMax.attr('y', y(lineY) - constants.label.aboveRangeOffset);
    }
  };
