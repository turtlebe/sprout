import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { InterpolationType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import { getRulesFromStartToEnd } from './get-time-ranges-from-start-to-end';
import { repeatInterval as getRepeatedIntervals } from './repeat-interval';

const width = 1000;
const height = 1000;
const [alertRule] = mockAlertRules;
const { startsAt, repeatInterval, rules } = alertRule;

function getScales(startDateTime, endDateTime) {
  const xScale = d3.scaleTime().domain([startDateTime, endDateTime]).range([0, width]);
  const yScale = d3.scaleLinear().domain([100, 0]).range([0, height]);

  return { x: xScale, y: yScale };
}

describe('getRepeatedIntervals', () => {
  it('returns the interval at startDateTime when editing', () => {
    const startDateTime = moment(startsAt)
      .add(5 * repeatInterval, 'seconds')
      .toDate();

    const repeatedIntervals = getRepeatedIntervals({
      rulesOrActions: rules,
      alertRuleOrSchedule: alertRule,
      startDateTime,
      endDateTime: undefined,
      isEditing: true,
    });

    expect(repeatedIntervals).toEqual([
      { ...rules[0], time: new Date('2019-10-21T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-21T09:00:00.000Z') },
    ]);
  });

  it('returns 1 interval when the time window is exactly equal to the interval', () => {
    const startDateTime = moment(startsAt)
      .add(5 * repeatInterval, 'seconds')
      .toDate();
    const endDateTime = moment(startDateTime)
      .add(1 * repeatInterval - 1, 'seconds')
      .toDate();

    const repeatedIntervals = getRepeatedIntervals({
      rulesOrActions: rules,
      alertRuleOrSchedule: alertRule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(repeatedIntervals).toEqual([
      { ...rules[0], time: new Date('2019-10-21T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-21T09:00:00.000Z') },
    ]);
  });

  it("returns 2 intervals when the startDateTime is before the AlertRule's startsAt", () => {
    const startDateTime = moment(startsAt)
      .add(5 * repeatInterval - 1, 'seconds')
      .toDate();
    const endDateTime = moment(startDateTime)
      .add(1 * repeatInterval, 'seconds')
      .toDate();

    const repeatedIntervals = getRepeatedIntervals({
      rulesOrActions: rules,
      alertRuleOrSchedule: alertRule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(repeatedIntervals).toEqual([
      { ...rules[0], time: new Date('2019-10-20T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-20T09:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-21T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-21T09:00:00.000Z') },
    ]);
  });

  it('returns 2 intervals when the endDateTime is after the end of the interval', () => {
    const startDateTime = moment(startsAt)
      .add(5 * repeatInterval, 'seconds')
      .toDate();
    const endDateTime = moment(startDateTime)
      .add(1 * repeatInterval + 1, 'seconds')
      .toDate();

    const repeatedIntervals = getRepeatedIntervals({
      rulesOrActions: rules,
      alertRuleOrSchedule: alertRule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(repeatedIntervals).toEqual([
      { ...rules[0], time: new Date('2019-10-21T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-21T09:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-22T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-22T09:00:00.000Z') },
    ]);
  });

  it('returns the first interval when startDateTime is before startsAt', () => {
    const startDateTime = moment(startsAt)
      .subtract(repeatInterval * 10, 'seconds')
      .toDate();
    const endDateTime = moment(startsAt).add(repeatInterval, 'seconds').toDate();

    const repeatedIntervals = getRepeatedIntervals({
      rulesOrActions: rules,
      alertRuleOrSchedule: alertRule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(repeatedIntervals).toEqual([
      { ...rules[0], time: new Date('2019-10-16T08:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-16T09:00:00.000Z') },
    ]);
  });

  it('returns 2 intervals when the endDateTime is after the end of the interval', () => {});
});

describe('getRulesFromStartToEnd', () => {
  it('returns a padded interval when interpolation type is none', () => {
    const startDateTime = moment(startsAt).toDate();
    const endDateTime = moment(startsAt).add(repeatInterval, 'seconds').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const result = getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y });

    expect(result).toEqual([
      { ...rules[1], time: new Date('2019-10-16T07:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-16T08:00:00.000Z'), isVirtual: true },
      { ...rules[0], time: new Date('2019-10-16T08:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-16T09:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-16T09:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-17T07:00:00.000Z'), isVirtual: true },
    ]);
  });

  it('returns a padded interval when interpolation type is linear', () => {
    const startDateTime = moment(startsAt).toDate();
    const endDateTime = moment(startsAt).add(repeatInterval, 'seconds').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const linearAlertRule = { ...alertRule, interpolationType: InterpolationType.linear };
    const result = getRulesFromStartToEnd({ alertRule: linearAlertRule, startDateTime, endDateTime, x, y });

    expect(result).toEqual([
      { isVirtual: true, lte: 73.30434782608695, gte: 60.43478260869565, time: new Date('2019-10-16T07:00:00.000Z') },
      { lte: 73, gte: 60, time: new Date('2019-10-16T08:00:00.000Z') },
      { lte: 80, gte: 70, time: new Date('2019-10-16T09:00:00.000Z') },
      { isVirtual: true, lte: 73.30434782608695, gte: 60.434782608695656, time: new Date('2019-10-17T07:00:00.000Z') },
    ]);
  });

  it('repeats the interval for two days', () => {
    const startDateTime = moment(startsAt).add().toDate();
    const endDateTime = moment(startsAt)
      .add(repeatInterval * 2, 'seconds')
      .toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const result = getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y });

    expect(result).toEqual([
      // 1st day
      { ...rules[1], time: new Date('2019-10-16T07:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-16T08:00:00.000Z'), isVirtual: true },
      { ...rules[0], time: new Date('2019-10-16T08:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-16T09:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-16T09:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-17T07:00:00.000Z'), isVirtual: true },
      // 2nd day
      { ...rules[1], time: new Date('2019-10-17T07:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-17T08:00:00.000Z'), isVirtual: true },
      { ...rules[0], time: new Date('2019-10-17T08:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-17T09:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-17T09:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-18T07:00:00.000Z'), isVirtual: true },
    ]);
  });

  it('repeats the interval for two days starting at the day before', () => {
    const startDateTime = moment(startsAt)
      .add(repeatInterval * 5 - 1, 'seconds')
      .toDate();
    const endDateTime = moment(startDateTime).add(repeatInterval, 'seconds').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const result = getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y });

    expect(result).toEqual([
      // 1st day
      { ...rules[1], time: new Date('2019-10-20T07:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-20T08:00:00.000Z'), isVirtual: true },
      { ...rules[0], time: new Date('2019-10-20T08:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-20T09:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-20T09:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-21T07:00:00.000Z'), isVirtual: true },
      // 2nd day
      { ...rules[1], time: new Date('2019-10-21T07:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-21T08:00:00.000Z'), isVirtual: true },
      { ...rules[0], time: new Date('2019-10-21T08:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-21T09:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-21T09:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-22T07:00:00.000Z'), isVirtual: true },
    ]);
  });

  it('returns only one interval in edit mode', () => {
    const startDateTime = moment(startsAt).toDate();
    const endDateTime = moment(startsAt)
      .add(repeatInterval * 10, 'seconds')
      .toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const result = getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y, isEditing: true });

    expect(result).toEqual([
      { ...rules[1], time: new Date('2019-10-16T07:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-16T08:00:00.000Z'), isVirtual: true },
      { ...rules[0], time: new Date('2019-10-16T08:00:00.000Z') },
      { ...rules[0], time: new Date('2019-10-16T09:00:00.000Z'), isVirtual: true },
      { ...rules[1], time: new Date('2019-10-16T09:00:00.000Z') },
      { ...rules[1], time: new Date('2019-10-17T07:00:00.000Z'), isVirtual: true },
    ]);
  });
});
