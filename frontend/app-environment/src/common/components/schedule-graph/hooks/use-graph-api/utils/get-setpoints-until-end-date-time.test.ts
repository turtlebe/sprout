import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { InterpolationType, Schedule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import { getSetpointsUntilEndDateTime } from '.';
const width = 1000;
const height = 1000;

describe('getSetpointsUntilEndDateTime no interpolation', () => {
  const schedule: Schedule = {
    ...mockSchedules[0],
    actions: [
      { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
      { time: 7200, value: '20', valueType: 'SINGLE_VALUE' },
    ],
    repeatInterval: 86400, // 24 hours schedule
    startsAt: '2022-01-01T00:00:00Z',
    activatesAt: '2022-01-01T00:00:00Z',
  };

  function getScales(startDateTime, endDateTime) {
    const xScale = d3.scaleTime().domain([startDateTime, endDateTime]).range([0, width]);
    const yScale = d3.scaleLinear().domain([100, 0]).range([0, height]);

    return { x: xScale, y: yScale };
  }

  it('returns a repeatable action pattern for a day', () => {
    const startDateTime = moment('2022-01-04T00:00:00Z').toDate();
    const endDateTime = moment('2022-01-05T00:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(6);
    expect(actions).toEqual([
      { ...schedule.actions[1], time: new Date('2022-01-04T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-04T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-05T00:00:00Z'), isVirtual: true },
    ]);
  });

  it('returns a repeatable action pattern for a day (when startDateTime/endDateTime are less than 24 hours)', () => {
    const startDateTime = moment('2022-01-04T06:00:00Z').toDate();
    const endDateTime = moment('2022-01-04T20:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(6);
    expect(actions).toEqual([
      { ...schedule.actions[1], time: new Date('2022-01-04T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-04T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-05T00:00:00Z'), isVirtual: true },
    ]);
  });

  it('returns a repeatable action pattern two days', () => {
    const startDateTime = moment('2022-01-04T00:00:00Z').toDate();
    const endDateTime = moment('2022-01-06T00:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(12);
    expect(actions).toEqual([
      { ...schedule.actions[1], time: new Date('2022-01-04T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-04T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-05T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-05T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-05T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-05T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-05T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-05T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-06T00:00:00Z'), isVirtual: true },
    ]);
  });

  it('returns a repeatable action pattern two days (when startDateTime/endDateTime are more than 24 hours and less than 48 hours)', () => {
    const startDateTime = moment('2022-01-04T06:00:00Z').toDate();
    const endDateTime = moment('2022-01-05T20:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(12);
    expect(actions).toEqual([
      { ...schedule.actions[1], time: new Date('2022-01-04T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-04T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-05T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-05T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-05T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-05T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-05T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-05T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-06T00:00:00Z'), isVirtual: true },
    ]);
  });

  it('truncates the schedule when it ends', () => {
    const schedule: Schedule = {
      ...mockSchedules[0],
      actions: [
        { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
        { time: 7200, value: '20', valueType: 'SINGLE_VALUE' },
        { time: 10800, value: '30', valueType: 'SINGLE_VALUE' },
      ],
      repeatInterval: 14400, // 4 hours schedule
      startsAt: '2022-01-01T00:00:00Z',
      activatesAt: '2022-01-01T00:00:00Z',
      endsAt: '2022-01-01T02:00:00Z',
    };
    const startDateTime = moment('2022-01-01T00:00:00Z').toDate();
    const endDateTime = moment('2022-02-01T00:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const setpoints = getSetpointsUntilEndDateTime({
      schedule,
      startDateTime,
      endDateTime,
      x,
      y,
      isEditing: false,
    });

    expect(setpoints).toEqual([
      { ...schedule.actions[2], time: new Date('2022-01-01T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[2], time: new Date('2022-01-01T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-01T02:00:00Z'), isVirtual: true },
    ]);
    const setpoints2 = getSetpointsUntilEndDateTime({
      schedule: { ...schedule, endsAt: '2022-01-01T03:00:00Z' },
      startDateTime,
      endDateTime,
      x,
      y,
      isEditing: false,
    });

    expect(setpoints2).toEqual([
      { ...schedule.actions[2], time: new Date('2022-01-01T00:00:00Z'), isVirtual: true },
      { ...schedule.actions[2], time: new Date('2022-01-01T01:00:00Z'), isVirtual: true },
      { ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-01T02:00:00Z'), isVirtual: true },
      { ...schedule.actions[1], time: new Date('2022-01-01T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-01T03:00:00Z'), isVirtual: true },
    ]);
  });
});

describe('getSetpointsUntilEndDateTime linear interpolation', () => {
  const schedule: Schedule = {
    ...mockSchedules[0],
    interpolationType: InterpolationType.linear,
    actions: [
      { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
      { time: 7200, value: '20', valueType: 'SINGLE_VALUE' },
    ],
    repeatInterval: 86400, // 24 hours schedule
    startsAt: '2022-01-01T00:00:00Z',
    activatesAt: '2022-01-00T00:00:00Z',
  };

  function getScales(startDateTime, endDateTime) {
    const xScale = d3.scaleTime().domain([startDateTime, endDateTime]).range([0, width]);
    const yScale = d3.scaleLinear().domain([100, 0]).range([0, height]);

    return { x: xScale, y: yScale };
  }

  it('returns a repeatable action pattern for a day', () => {
    const startDateTime = moment('2022-01-04T00:00:00Z').toDate();
    const endDateTime = moment('2022-01-05T00:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(4);
    expect(actions).toEqual([
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-04T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-05T00:00:00.000Z'),
        isVirtual: true,
      },
    ]);
  });

  it('returns a repeatable action pattern for a day (when startDateTime/endDateTime are less than 24 hours)', () => {
    const startDateTime = moment('2022-01-04T06:00:00Z').toDate();
    const endDateTime = moment('2022-01-04T20:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(4);
    expect(actions).toEqual([
      {
        valueType: 'SINGLE_VALUE',
        value: '10.43478260869566',
        time: new Date('2022-01-04T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-05T00:00:00.000Z'),
        isVirtual: true,
      },
    ]);
  });

  it('returns a repeatable action pattern two days', () => {
    const startDateTime = moment('2022-01-04T00:00:00Z').toDate();
    const endDateTime = moment('2022-01-06T00:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(8);
    expect(actions).toEqual([
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-04T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-05T00:00:00.000Z'),
        isVirtual: true,
      },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-05T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-05T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-05T02:00:00Z') },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.434782608695647',
        time: new Date('2022-01-06T00:00:00.000Z'),
        isVirtual: true,
      },
    ]);
  });

  it('returns a repeatable action pattern two days (when startDateTime/endDateTime are more than 24 hours and less than 48 hours)', () => {
    const startDateTime = moment('2022-01-04T06:00:00Z').toDate();
    const endDateTime = moment('2022-01-05T20:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const actions = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });

    expect(actions).toHaveLength(8);
    expect(actions).toEqual([
      {
        valueType: 'SINGLE_VALUE',
        value: '10.43478260869566',
        time: new Date('2022-01-04T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.43478260869566',
        time: new Date('2022-01-05T00:00:00.000Z'),
        isVirtual: true,
      },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.43478260869566',
        time: new Date('2022-01-05T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-05T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-05T02:00:00Z') },
      {
        valueType: 'SINGLE_VALUE',
        value: '10.43478260869566',
        time: new Date('2022-01-06T00:00:00.000Z'),
        isVirtual: true,
      },
    ]);
  });

  it('truncates the schedule when it ends', () => {
    const schedule: Schedule = {
      ...mockSchedules[0],
      interpolationType: InterpolationType.linear,
      actions: [
        { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
        { time: 7200, value: '20', valueType: 'SINGLE_VALUE' },
        { time: 10800, value: '30', valueType: 'SINGLE_VALUE' },
      ],
      repeatInterval: 14400, // 4 hours schedule
      startsAt: '2022-01-01T00:00:00Z',
      activatesAt: '2022-01-01T00:00:00Z',
      endsAt: '2022-01-01T02:00:00Z',
    };
    const startDateTime = moment('2022-01-01T00:00:00Z').toDate();
    const endDateTime = moment('2022-02-01T00:00:00Z').toDate();
    const { x, y } = getScales(startDateTime, endDateTime);
    const setpoints = getSetpointsUntilEndDateTime({
      schedule,
      startDateTime,
      endDateTime,
      x,
      y,
      isEditing: false,
    });

    expect(setpoints).toEqual([
      {
        valueType: 'SINGLE_VALUE',
        value: '19.999999999999996',
        time: new Date('2022-01-01T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') },
      { ...schedule.actions[0], time: new Date('2022-01-01T02:00:00Z'), isVirtual: true },
    ]);
    const setpoints2 = getSetpointsUntilEndDateTime({
      schedule: { ...schedule, endsAt: '2022-01-01T03:00:00Z' },
      startDateTime,
      endDateTime,
      x,
      y,
      isEditing: false,
    });

    expect(setpoints2).toEqual([
      {
        valueType: 'SINGLE_VALUE',
        value: '19.999999999999996',
        time: new Date('2022-01-01T00:00:00.000Z'),
        isVirtual: true,
      },
      { ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-01T02:00:00Z') },
      { ...schedule.actions[1], time: new Date('2022-01-01T03:00:00Z'), isVirtual: true },
    ]);
  });
});
