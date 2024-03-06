import { buildRolledUpByTimeObservation, buildSchedule } from '@plentyag/app-environment/src/common/test-helpers';
import { TimeSummarization, YAxisScaleType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import { DateTime, Settings } from 'luxon';

import {
  getActionsBetween,
  getObservationsBetween,
  getObservationStatsFromActions,
} from './get-observation-stats-from-actions';

const observations = [
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T01:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T02:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T03:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T04:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T05:00:00Z' }),
];

const schedule = buildSchedule({
  startsAt: '2023-01-01T00:00:00Z',
  actions: [
    { time: 3600 * 1, value: '10', valueType: 'SINGLE_VALUE' }, // 2023-01-01T01:00:00Z
    { time: 3600 * 2, value: '20', valueType: 'SINGLE_VALUE' }, // 2023-01-01T02:00:00Z
    { time: 3600 * 3, value: '30', valueType: 'SINGLE_VALUE' }, // 2023-01-01T03:00:00Z
    { time: 3600 * 4, value: '40', valueType: 'SINGLE_VALUE' }, // 2023-01-01T04:00:00Z
    { time: 3600 * 5, value: '50', valueType: 'SINGLE_VALUE' }, // 2023-01-01T05:00:00Z
  ],
});
const now = new Date('2023-01-01T05:10:00Z');
const startDateTime = new Date('2023-01-01T01:30:00Z');
const endDateTime = new Date('2023-01-01T04:30:00Z');
const timeSummarization = TimeSummarization.median;
const x = d3.scaleTime().domain([startDateTime, endDateTime]);
const y: d3.AxisScale<YAxisScaleType> = d3.scaleLinear().domain([0, 100]).range([0, 100]);

describe('getActionsBetween', () => {
  it('returns Actions between two dates', () => {
    const result = getActionsBetween({ schedule, startDateTime, endDateTime, x, y });

    expect(result).toEqual([
      { time: new Date('2023-01-01T01:30:00Z'), value: '10', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T02:00:00Z'), value: '20', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T03:00:00Z'), value: '30', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T04:00:00Z'), value: '40', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T04:30:00Z'), value: '40', valueType: 'SINGLE_VALUE' },
    ]);
  });

  it('returns Actions between two dates when startDateTime/endDateTime match with the first/last action', () => {
    const result = getActionsBetween({
      schedule,
      startDateTime: new Date('2023-01-01T01:00:00Z'),
      endDateTime: new Date('2023-01-01T05:00:00Z'),
      x,
      y,
    });

    expect(result).toEqual([
      { time: new Date('2023-01-01T01:00:00Z'), value: '10', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T02:00:00Z'), value: '20', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T03:00:00Z'), value: '30', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T04:00:00Z'), value: '40', valueType: 'SINGLE_VALUE' },
      { time: new Date('2023-01-01T05:00:00Z'), value: '50', valueType: 'SINGLE_VALUE' },
    ]);
  });
});

describe('getObservationsBetween', () => {
  it('returns observations between two dates', () => {
    const result = getObservationsBetween(observations, startDateTime, endDateTime);

    expect(result).toEqual(observations.slice(1, -1));
  });

  it('returns no observations when the start/end dates do not overlap', () => {
    const result = getObservationsBetween(
      observations,
      new Date('2023-01-02T01:30:00Z'),
      new Date('2023-01-02T04:30:00Z')
    );

    expect(result).toEqual([]);
  });
});

describe('getObservationStatsFromActions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterEach(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  it('returns an empty array when the schedule is not defined', () => {
    const result = getObservationStatsFromActions({
      schedule: null,
      startDateTime,
      endDateTime,
      x,
      y,
      timeSummarization,
      observations,
    });

    expect(result).toEqual([]);
  });

  it('returns an array of observations stats for each segment of the schedule', () => {
    const result = getObservationStatsFromActions({
      schedule,
      startDateTime,
      endDateTime,
      x,
      y,
      timeSummarization,
      observations,
    });
    const observationStats = {
      count: 1,
      min: observations[0].median,
      max: observations[0].median,
      mean: observations[0].median,
      median: observations[0].median,
      stddev: 0,
    };

    expect(result).toEqual([
      {
        startDateTime,
        endDateTime: new Date('2023-01-01T02:00:00Z'),
        action: { time: new Date('2023-01-01T01:30:00Z'), value: '10', valueType: 'SINGLE_VALUE' },
        observationStats,
      },
      {
        startDateTime: new Date('2023-01-01T02:00:00Z'),
        endDateTime: new Date('2023-01-01T03:00:00Z'),
        action: { time: new Date('2023-01-01T02:00:00Z'), value: '20', valueType: 'SINGLE_VALUE' },
        observationStats: { ...observationStats, count: 2 },
      },
      {
        startDateTime: new Date('2023-01-01T03:00:00Z'),
        endDateTime: new Date('2023-01-01T04:00:00Z'),
        action: { time: new Date('2023-01-01T03:00:00Z'), value: '30', valueType: 'SINGLE_VALUE' },
        observationStats: { ...observationStats, count: 2 },
      },
      {
        startDateTime: new Date('2023-01-01T04:00:00Z'),
        endDateTime: new Date('2023-01-01T04:30:00Z'),
        action: { time: new Date('2023-01-01T04:00:00Z'), value: '40', valueType: 'SINGLE_VALUE' },
        observationStats,
      },
    ]);
  });

  it('sets the endDateTime as now when endDateTime is in the future', () => {
    const result = getObservationStatsFromActions({
      schedule,
      startDateTime,
      endDateTime: DateTime.fromJSDate(now).plus({ minutes: 30 }).toJSDate(),
      x,
      y,
      timeSummarization,
      observations,
    });
    const observationStats = {
      count: 1,
      min: observations[0].median,
      max: observations[0].median,
      mean: observations[0].median,
      median: observations[0].median,
      stddev: 0,
    };

    expect(result).toEqual([
      {
        startDateTime: startDateTime,
        endDateTime: new Date('2023-01-01T02:00:00Z'),
        action: { time: new Date('2023-01-01T01:30:00Z'), value: '10', valueType: 'SINGLE_VALUE' },
        observationStats,
      },
      {
        startDateTime: new Date('2023-01-01T02:00:00Z'),
        endDateTime: new Date('2023-01-01T03:00:00Z'),
        action: { time: new Date('2023-01-01T02:00:00Z'), value: '20', valueType: 'SINGLE_VALUE' },
        observationStats: { ...observationStats, count: 2 },
      },
      {
        startDateTime: new Date('2023-01-01T03:00:00Z'),
        endDateTime: new Date('2023-01-01T04:00:00Z'),
        action: { time: new Date('2023-01-01T03:00:00Z'), value: '30', valueType: 'SINGLE_VALUE' },
        observationStats: { ...observationStats, count: 2 },
      },
      {
        startDateTime: new Date('2023-01-01T04:00:00Z'),
        endDateTime: new Date('2023-01-01T05:00:00Z'),
        action: { time: new Date('2023-01-01T04:00:00Z'), value: '40', valueType: 'SINGLE_VALUE' },
        observationStats: { ...observationStats, count: 2 },
      },
      {
        startDateTime: new Date('2023-01-01T05:00:00Z'),
        endDateTime: now,
        action: { time: new Date('2023-01-01T05:00:00Z'), value: '50', valueType: 'SINGLE_VALUE' },
        observationStats,
      },
    ]);
  });
});
