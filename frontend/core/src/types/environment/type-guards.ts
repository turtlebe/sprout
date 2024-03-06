import * as d3 from 'd3';

import { AlertRule, Metric, Schedule } from '.';

export function isScaleLinear(scale: d3.AxisScale<string | d3.NumberValue>): scale is d3.ScaleLinear<number, number> {
  return scale && scale.hasOwnProperty('invert');
}

export function isMetric(metricOrSchedule: Metric | Schedule): metricOrSchedule is Metric {
  return metricOrSchedule.hasOwnProperty('measurementType');
}

export function isAlertRule(alertRuleOrSchedule: AlertRule | Schedule): alertRuleOrSchedule is AlertRule {
  return alertRuleOrSchedule.hasOwnProperty('alertRuleType');
}

export function isSchedule(object: any): object is Schedule {
  return Boolean(
    object &&
      object.hasOwnProperty('scheduleType') &&
      object.hasOwnProperty('path') &&
      object.hasOwnProperty('startsAt') &&
      object.hasOwnProperty('activatesAt')
  );
}
