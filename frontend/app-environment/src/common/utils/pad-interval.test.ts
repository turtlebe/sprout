import { buildAlertRule, buildSchedule, mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { InterpolationType, Rule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import {
  getInterpolatedRuleAt,
  padIntervalAlertRule,
  padIntervalNoInterpolation,
  padIntervalSchedule,
} from './pad-interval';

const [alertRule] = mockAlertRules;
const startDateTime = moment(alertRule.startsAt).toDate();
const endDateTime = moment(alertRule.startsAt).add(alertRule.repeatInterval, 'seconds').toDate();
const width = 1000;
const height = 1000;
const xScale = d3.scaleTime().domain([startDateTime, endDateTime]).range([0, width]);
const yScale = d3.scaleLinear().domain([100, 0]).range([0, height]);

describe('padIntervalAlertRule - with Linear Interpolation', () => {
  it('returns an empty array when rules are empty or undefined', () => {
    const alertRule = buildAlertRule({ interpolationType: InterpolationType.linear });

    expect(padIntervalAlertRule({ alertRule: { ...alertRule, rules: undefined }, x: xScale, y: yScale })).toEqual([]);
    expect(padIntervalAlertRule({ alertRule: { ...alertRule, rules: null }, x: xScale, y: yScale })).toEqual([]);
    expect(padIntervalAlertRule({ alertRule: { ...alertRule, rules: [] }, x: xScale, y: yScale })).toEqual([]);
  });

  it('returns a padded Linear Interpolated Interval', () => {
    const alertRule = buildAlertRule({ interpolationType: InterpolationType.linear });

    const rules = padIntervalAlertRule({ alertRule, x: xScale, y: yScale });

    // 2 rules initially, after padding, we should have 4 when InterpolationType is LINEAR.
    expect(rules).toEqual([
      {
        isVirtual: true,
        gte: 60.43478260869565,
        lte: 73.30434782608695,
        time: 0,
      },
      alertRule.rules[0],
      alertRule.rules[1],
      {
        isVirtual: true,
        gte: 60.434782608695656,
        lte: 73.30434782608695,
        time: 86400,
      },
    ]);
  });

  it('throws an error when using a non linear scale on the Y Axis', () => {
    const alertRule = buildAlertRule({ interpolationType: InterpolationType.linear });
    const yScale = d3.scalePoint().domain(['a', 'b']).range([0, height]);

    expect(() => padIntervalAlertRule({ alertRule, x: xScale, y: yScale })).toThrowError();
  });
});

describe('padIntervalSchedule - with Linear Interpolation', () => {
  it('returns an empty array when rules are empty or undefined', () => {
    const schedule = buildSchedule({ interpolationType: InterpolationType.linear });

    expect(padIntervalSchedule({ schedule: { ...schedule, actions: undefined }, x: xScale, y: yScale })).toEqual([]);
    expect(padIntervalSchedule({ schedule: { ...schedule, actions: null }, x: xScale, y: yScale })).toEqual([]);
    expect(padIntervalSchedule({ schedule: { ...schedule, actions: [] }, x: xScale, y: yScale })).toEqual([]);
  });

  it('returns a padded Linear Interpolated Interval', () => {
    const schedule = buildSchedule({
      interpolationType: InterpolationType.linear,
      actions: [
        { valueType: 'SINGLE_VALUE', time: 3600, value: '20' },
        { valueType: 'SINGLE_VALUE', time: 7200, value: '40' },
      ],
    });

    const actions = padIntervalSchedule({ schedule, x: xScale, y: yScale });

    // 2 actions initially, after padding, we should have 4 when InterpolationType is LINEAR.
    expect(actions).toEqual([
      {
        isVirtual: true,
        value: '20.869565217391937',
        valueType: 'SINGLE_VALUE',
        time: 0,
      },
      schedule.actions[0],
      schedule.actions[1],
      {
        isVirtual: true,
        value: '20.86956521738903',
        valueType: 'SINGLE_VALUE',
        time: 86400,
      },
    ]);
  });

  it('returns a padded Linear Interpolated Interval for multiple Values', () => {
    const schedule = buildSchedule({
      interpolationType: InterpolationType.linear,
      actions: [
        { valueType: 'MULTIPLE_VALUE', time: 3600, values: { zone1: '10', zone2: '20' } },
        { valueType: 'MULTIPLE_VALUE', time: 7200, values: { zone1: '20', zone2: '40' } },
      ],
    });

    const actions = padIntervalSchedule({ schedule, x: xScale, y: yScale });

    // 2 actions initially, after padding, we should have 4 when InterpolationType is LINEAR.
    expect(actions).toEqual([
      {
        isVirtual: true,
        values: {
          zone1: '10.434782608695969',
          zone2: '20.869565217391937',
        },
        valueType: 'MULTIPLE_VALUE',
        time: 0,
      },
      schedule.actions[0],
      schedule.actions[1],
      {
        isVirtual: true,
        values: {
          zone1: '10.434782608694515',
          zone2: '20.86956521738903',
        },
        valueType: 'MULTIPLE_VALUE',
        time: 86400,
      },
    ]);
  });

  it('throws an error when using a non linear scale on the Y Axis', () => {
    const schedule = buildSchedule({ interpolationType: InterpolationType.linear });
    const yScale = d3.scalePoint().domain(['a', 'b']).range([0, height]);

    expect(() => padIntervalSchedule({ schedule, x: xScale, y: yScale })).toThrowError();
  });
});

describe('getInterpolatedRuleAt', () => {
  it('returns an interpolated rule', () => {
    // hack the type until we fix the typings in pad-interval.
    const pointA = { time: moment(alertRule.startsAt), gte: 10, lte: 20 } as unknown as Rule;
    const pointB = { time: moment(alertRule.startsAt).add(3600, 'seconds'), gte: 20, lte: 40 } as unknown as Rule;

    const interpolatedRule = getInterpolatedRuleAt({ x: xScale, y: yScale })({
      timeDesired: 1800,
      pointA,
      pointB,
      startsAt: alertRule.startsAt,
    });

    expect(interpolatedRule).toEqual({ time: 1800, gte: 15.000000000000002, lte: 30.000000000000004, isVirtual: true });
  });

  it('returns an interpolated rule with "gte" only', () => {
    // hack the type until we fix the typings in pad-interval.
    const pointA = { time: moment(alertRule.startsAt), gte: 10 } as unknown as Rule;
    const pointB = { time: moment(alertRule.startsAt).add(3600, 'seconds'), gte: 20 } as unknown as Rule;

    const interpolatedRule = getInterpolatedRuleAt({ x: xScale, y: yScale })({
      timeDesired: 1800,
      pointA,
      pointB,
      startsAt: alertRule.startsAt,
    });

    expect(interpolatedRule).toEqual({ time: 1800, gte: 15.000000000000002, lte: null, isVirtual: true });
  });

  it('returns an interpolated rule with "lte" only', () => {
    // hack the type until we fix the typings in pad-interval.
    const pointA = { time: moment(alertRule.startsAt), lte: 10 } as unknown as Rule;
    const pointB = { time: moment(alertRule.startsAt).add(3600, 'seconds'), lte: 20 } as unknown as Rule;

    const interpolatedRule = getInterpolatedRuleAt({ x: xScale, y: yScale })({
      timeDesired: 1800,
      pointA,
      pointB,
      startsAt: alertRule.startsAt,
    });

    expect(interpolatedRule).toEqual({ time: 1800, gte: null, lte: 15.000000000000002, isVirtual: true });
  });
});

describe('padIntervalNoInterpolation', () => {
  it('pads an alert rule', () => {
    expect(
      padIntervalNoInterpolation(86400, [
        { time: 3600, gte: 10, lte: 20 },
        { time: 7200, gte: 20, lte: 40 },
      ])
    ).toEqual([
      { time: 0, gte: 20, lte: 40, isVirtual: true },
      { time: 3600, gte: 10, lte: 20, isVirtual: undefined },
      { time: 7200, gte: 20, lte: 40, isVirtual: undefined },
      { time: 86400, gte: 10, lte: 20, isVirtual: true },
    ]);
  });

  it('pads a schedule', () => {
    expect(
      padIntervalNoInterpolation(86400, [
        { time: 3600, value: 20 },
        { time: 7200, value: 40 },
      ])
    ).toEqual([
      { time: 0, value: 40, isVirtual: true },
      { time: 3600, value: 20, isVirtual: undefined },
      { time: 7200, value: 40, isVirtual: undefined },
      { time: 86400, value: 20, isVirtual: true },
    ]);
  });
});
