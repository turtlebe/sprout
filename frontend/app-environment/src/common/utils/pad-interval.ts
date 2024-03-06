import { Action, AlertRule, InterpolationType, Rule, Schedule } from '@plentyag/core/src/types/environment';
import { isScaleLinear } from '@plentyag/core/src/types/environment/type-guards';
import { getSlopeAndIntercept } from '@plentyag/core/src/utils';
import { isNumber } from 'lodash';
import moment from 'moment';

import { UseMetricGraphApi } from '../hooks';

/**
 * Type to define a function to calculate a points at a desired time given two other points.
 */
export type GetPointAt<T extends Rule | Action> = (args: {
  timeDesired: number;
  pointA: T;
  pointB: T;
  startsAt: string;
}) => T;

/**
 * Wrapper for GetPointAt that injects x, y d3 scales.
 */
export type GetPointAtCallback<T extends Rule | Action> = (args: {
  x: UseMetricGraphApi['scale']['x'];
  y: UseMetricGraphApi['scale']['y'];
}) => GetPointAt<T>;

export interface PadIntervalLinearInterpolation<T extends Rule | Action> {
  startsAt: string;
  repeatInterval: number;
  points: T[];
  getPointAt: GetPointAt<T>;
}

/**
 * Pad a Rule[] configuration when the Interpolation Type is LINEAR.
 *
 * For example, for the given specificiation:
 *
 * [
 *   (time: 100, min: 10, max: 40),
 *   (time: 200, min: 20, max: 30)
 * ]
 *
 * We need two extra Rule to render the D3 Area as a repeatable shape, this function should return:
 *
 * - Let's consider the LAST Rule in the PREVIOUS interval being `previousIntervalLastRule`.
 * - Let's consider the FIRST Rule in the CURRENT interval being `currentIntervalFirstRule`.
 * - Let's consider the LAST Rule in the CURRENT interval being `currentIntervalLastRule`.
 * - Let's consider the FIRST Rule in the NEXT interval being `nextIntervalFirstTimeRule`.
 *
 * [
 *   (
 *      time: 0, // The beginning of the interval
 *      min: YMIN1,  // the `min` of the point at X= 0 that intersects the line between `previousIntervalLastRule` and `currentIntervalFirstRule`.
 *      max: YMMAX1,  // the `max` of the point at X= 0 that intersects the line between `previousIntervalLastRule` and `currentIntervalFirstRule`.
 *   ),
 *   (time: 100, min: 10, max: 40),
 *   (time: 200, min: 20, max: 30)
 *   (time: alertRule.repeatInterval, min: YMIN2, max: YMAX2)
 *   (
 *      time: alertRule.repeatInterval, // The end of the interval
 *      min: YMIN2,  // the `min` of the point at X = alertRule.repeatInterval that intersects the line between `currentIntervalLastRule` and `nextIntervalFirstTimeRule`.
 *      max: YMMAX2,  // the `max` of the point at X = alertRule.repeatInterval that intersects the line between `currentIntervalLastRule` and `nextIntervalFirstTimeRule`.
 *   ),
 * ].
 *
 * Note: if the first rule's time is 0 (or the last rule's time is at repeatInterval), we still add padding as it will be ignored
 * when rendered through the graph.
 */
export function padIntervalLinearInterpolation<T extends Rule | Action>({
  startsAt,
  repeatInterval,
  points,
  getPointAt,
}: PadIntervalLinearInterpolation<T>): T[] {
  if (!points || !points.length) {
    return [];
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const previousIntervalLastPoint: T = {
    ...lastPoint,
    time: moment(startsAt)
      .subtract(repeatInterval - lastPoint.time, 'seconds')
      .toDate(),
  };
  const nextIntervalFirstPoint: T = {
    ...firstPoint,
    time: moment(startsAt)
      .add(repeatInterval + firstPoint.time, 'seconds')
      .toDate(),
  };
  const currentIntervalFirstPoint: T = {
    ...firstPoint,
    time: moment(startsAt).add(firstPoint.time, 'seconds').toDate(),
  };
  const currentIntervalLastPoint: T = {
    ...lastPoint,
    time: moment(startsAt).add(lastPoint.time, 'seconds').toDate(),
  };

  const firstPointInCurrentInterval = getPointAt({
    timeDesired: 0,
    pointA: previousIntervalLastPoint,
    pointB: currentIntervalFirstPoint,
    startsAt,
  });
  const lastPointInCurrentInterval = getPointAt({
    timeDesired: repeatInterval,
    pointA: currentIntervalLastPoint,
    pointB: nextIntervalFirstPoint,
    startsAt,
  });

  return [firstPointInCurrentInterval, ...points, lastPointInCurrentInterval];
}

/**
 * Pad a Rule[] or Action[] configuration when the Interpolation Type is NONE.
 *
 * For example, for the given specificiation:
 *
 * [
 *   (time: 100, gte: 10, lte: 40),
 *   (time: 200, gte: 20, lte: 30)
 * ]
 *
 * We need two extra Rules to render the D3 Area as a repeatable shape, this function should return:
 *
 * [
 *   (time: 0, gte: 20, lte: 30),
 *   (time: 100, gte: 10, lte: 40),
 *   (time: 200, gte: 20, lte: 30)
 *   (time: alertRuleOrSchedule.repeatInterval, gte: 20, lte: 30)
 * ].
 *
 * Note: if the first rule's time is 0 (or the last rule's time is at repeatInterval), we still add padding as it will be ignored
 * when rendered through the graph.
 *
 * This example is illustrated for an AlertRule but the same works for Schedule's actions.
 */
export function padIntervalNoInterpolation<T extends Rule | Action>(repeatInterval: number, rulesOrActions: T[]): T[] {
  if (!rulesOrActions || !rulesOrActions.length) {
    return [];
  }

  const firstItem = rulesOrActions[0];
  const lastItem = rulesOrActions[rulesOrActions.length - 1];

  return [
    { ...lastItem, time: 0, isVirtual: true },
    ...rulesOrActions,
    { ...firstItem, time: repeatInterval, isVirtual: true },
  ];
}

/**
 * Given two Actions with single values, calculate the Action at the desired time on the X axis.
 */
const getActionAt: GetPointAtCallback<Action> =
  ({ x, y }) =>
  ({ timeDesired, pointA, pointB, startsAt }) => {
    const { m, b } = getSlopeAndIntercept({
      x1: x(pointA.time),
      x2: x(pointB.time),
      y1: y(pointA.value),
      y2: y(pointB.value),
    });

    // The X coordinate (using d3 scale) of the time desired.
    const xTimeDesired = x(moment(startsAt).add(timeDesired, 'seconds').toDate());

    if (!isScaleLinear(y)) {
      throw new Error('Non linear scale not supported yet');
    }

    // Now that we have M and B, we can calculate Y given X.
    return {
      time: timeDesired,
      valueType: 'SINGLE_VALUE',
      value: y.invert(m * xTimeDesired + b).toString(),
      isVirtual: true,
    };
  };

/**
 * Given two Actions with multiple values, calculate the Action at the desired time on the X axis.
 */
const getActionAtMultipleValue: GetPointAtCallback<Action> =
  ({ x, y }) =>
  ({ timeDesired, pointA, pointB, startsAt }) => {
    const slopesAndIntercepts: { [key: string]: { m: number; b: number } } = Object.keys(pointA.values).reduce(
      (accumulator, key) => {
        accumulator[key] = getSlopeAndIntercept({
          x1: x(pointA.time),
          x2: x(pointB.time),
          y1: y(pointA.values[key]),
          y2: y(pointB.values[key]),
        });

        return accumulator;
      },
      {}
    );

    // The X coordinate (using d3 scale) of the time desired.
    const xTimeDesired = x(moment(startsAt).add(timeDesired, 'seconds').toDate());

    if (!isScaleLinear(y)) {
      throw new Error('Non linear scale not supported yet');
    }

    // Now that we have M and B, we can calculate Y given X.
    return {
      time: timeDesired,
      valueType: 'MULTIPLE_VALUE',
      values: Object.keys(pointA.values).reduce((accumulator, key) => {
        accumulator[key] = y.invert(slopesAndIntercepts[key].m * xTimeDesired + slopesAndIntercepts[key].b).toString();

        return accumulator;
      }, {}),
      isVirtual: true,
    };
  };

export interface PadIntervalSchedule {
  schedule: Schedule;
  x: UseMetricGraphApi['scale']['x'];
  y: UseMetricGraphApi['scale']['y'];
}

/**
 * Pad an interval for a Schedule.
 */
export function padIntervalSchedule({ schedule, x, y }: PadIntervalSchedule): Action[] {
  const { startsAt, repeatInterval, actions } = schedule;

  if (schedule.interpolationType === InterpolationType.linear) {
    const getPointAt =
      schedule.actions?.[0]?.valueType === 'MULTIPLE_VALUE'
        ? getActionAtMultipleValue({ x, y })
        : getActionAt({ x, y });
    return padIntervalLinearInterpolation({
      startsAt,
      repeatInterval,
      points: actions,
      getPointAt,
    });
  }

  return padIntervalNoInterpolation(repeatInterval, actions);
}

/**
 * Given two Rule<Date>, calculate the Rule at the desired time on the X axis.
 */
export const getInterpolatedRuleAt: GetPointAtCallback<Rule> =
  ({ x, y }) =>
  ({ timeDesired, pointA, pointB, startsAt }) => {
    const { m: mMin, b: bMin } = getSlopeAndIntercept({
      x1: x(pointA.time),
      x2: x(pointB.time),
      y1: y(pointA.gte),
      y2: y(pointB.gte),
    });
    const { m: mMax, b: bMax } = getSlopeAndIntercept({
      x1: x(pointA.time),
      x2: x(pointB.time),
      y1: y(pointA.lte),
      y2: y(pointB.lte),
    });

    // The X coordinate (using d3 scale) of the time desired.
    const xTimeDesired = x(moment(startsAt).add(timeDesired, 'seconds').toDate());

    if (!isScaleLinear(y)) {
      throw new Error('Non linear scale not supported yet');
    }

    return {
      time: timeDesired,
      gte: isNumber(pointA.gte) && isNumber(pointB.gte) ? y.invert(mMin * xTimeDesired + bMin) : null,
      lte: isNumber(pointA.lte) && isNumber(pointB.lte) ? y.invert(mMax * xTimeDesired + bMax) : null,
      isVirtual: true,
    };
  };
export interface PadIntervalAlertRule {
  alertRule: AlertRule;
  x: UseMetricGraphApi['scale']['x'];
  y: UseMetricGraphApi['scale']['y'];
}

/**
 * Pad an interval for an AlertRule.
 */
export function padIntervalAlertRule({ alertRule, x, y }: PadIntervalAlertRule): Rule[] {
  const { startsAt, repeatInterval, rules } = alertRule;

  if (alertRule.interpolationType === InterpolationType.linear) {
    return padIntervalLinearInterpolation({
      startsAt,
      repeatInterval,
      points: rules,
      getPointAt: getInterpolatedRuleAt({ x, y }),
    });
  }

  return padIntervalNoInterpolation(repeatInterval, rules);
}
