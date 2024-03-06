import { getRuleAt } from '@plentyag/app-environment/src/common/utils';
import { AlertRule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { constants } from '../use-alert-rule-live-graph-api/render-alert-rule-live';

export interface UseAlertRuleLiveScale {
  alertRule: AlertRule;
  at: Date;
  observationValue: number;
}

export interface UseAlertRuleLiveScaleReturn {
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
  min: number;
  max: number;
  alertRuleMin: number;
  alertRuleMax: number;
  width: number;
  height: number;
}

export const useAlertRuleLiveScale = ({
  alertRule,
  at,
  observationValue,
}: UseAlertRuleLiveScale): UseAlertRuleLiveScaleReturn => {
  const { width, height, paddingX, paddingY, minY, maxY } = constants.graph;
  const rule = getRuleAt(alertRule, at);
  const alertRuleMin = rule.gte;
  const alertRuleMax = rule.lte;
  const min = observationValue ? Math.min(observationValue, alertRuleMin) : alertRuleMin;
  const max = observationValue ? Math.max(observationValue, alertRuleMax) : alertRuleMax;

  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, width - paddingX * 2]);

  const yScale = d3
    .scaleLinear()
    .domain([minY, maxY])
    .range([0, height - paddingY * 2]);

  return {
    x: xScale,
    y: yScale,
    min,
    max,
    alertRuleMin,
    alertRuleMax,
    width,
    height,
  };
};
