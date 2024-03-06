import { AlertRuleType, Metric } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { RenderFunction } from '.';

export interface UpdateAlertRule {
  show: boolean;
  metric: Metric;
  alertRuleType: AlertRuleType;
}

/**
 * Simply update the visibility of an AlertRule.
 */
export const updateAlertRule: RenderFunction<UpdateAlertRule> =
  ({}) =>
  ({ show, metric, alertRuleType }) => {
    d3.selectAll(['', 'alert-rule', `type_${alertRuleType}`, `metric_${metric.id}`].join('.')).attr(
      'visibility',
      show ? 'visible' : 'hidden'
    );
  };
