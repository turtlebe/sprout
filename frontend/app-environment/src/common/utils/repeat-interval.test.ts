import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { Schedule } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { repeatInterval } from './repeat-interval';

describe('getSetpointsUntilEndDateTime', () => {
  const schedule: Schedule = {
    ...mockSchedules[0],
    actions: [
      { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
      { time: 7200, value: '20', valueType: 'SINGLE_VALUE' },
    ],
    repeatInterval: 86400, // 24 hours schedule
    startsAt: '2022-01-01T00:00:00Z',
    activatesAt: '2022-01-00T00:00:00Z',
  };

  it('returns an interval for a day', () => {
    const startDateTime = moment('2022-01-04T00:00:00Z').toDate();
    const endDateTime = moment('2022-01-05T00:00:00Z').toDate();
    const actions = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: schedule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(actions).toHaveLength(2);
    expect(actions[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') });
    expect(actions[1]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') });
  });

  it('returns an interval for a day (when startDateTime/endDateTime are less than 24 hours)', () => {
    const startDateTime = moment('2022-01-04T06:00:00Z').toDate();
    const endDateTime = moment('2022-01-04T20:00:00Z').toDate();
    const actions = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: schedule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(actions).toHaveLength(2);
    expect(actions[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') });
    expect(actions[1]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') });
  });

  it('returns a repeated interval two days', () => {
    const startDateTime = moment('2022-01-04T00:00:00Z').toDate();
    const endDateTime = moment('2022-01-06T00:00:00Z').toDate();
    const actions = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: schedule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(actions).toHaveLength(4);
    expect(actions[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') });
    expect(actions[1]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') });
    expect(actions[2]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-05T01:00:00Z') });
    expect(actions[3]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-05T02:00:00Z') });
  });

  it('returns a repeatable action pattern two days (when startDateTime/endDateTime are more than 24 hours and less than 48 hours)', () => {
    const startDateTime = moment('2022-01-04T06:00:00Z').toDate();
    const endDateTime = moment('2022-01-05T20:00:00Z').toDate();
    const actions = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: schedule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(actions).toHaveLength(4);
    expect(actions[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-04T01:00:00Z') });
    expect(actions[1]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-04T02:00:00Z') });
    expect(actions[2]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-05T01:00:00Z') });
    expect(actions[3]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-05T02:00:00Z') });
  });

  it('truncates the schedules when it ends', () => {
    const schedule: Schedule = {
      ...mockSchedules[0],
      actions: [
        { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
        { time: 7200, value: '20', valueType: 'SINGLE_VALUE' },
        { time: 10800, value: '30', valueType: 'SINGLE_VALUE' },
      ],
      repeatInterval: 86400, // 24 hours schedule
      startsAt: '2022-01-01T00:00:00Z',
      activatesAt: '2022-01-01T00:00:00Z',
      endsAt: '2022-01-01T02:00:00Z',
    };
    const startDateTime = moment('2022-01-01T00:00:00Z').toDate();
    const endDateTime = moment('2022-02-01T00:00:00Z').toDate();
    const setpoints = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: schedule,
      startDateTime,
      endDateTime,
      isEditing: false,
    });

    expect(setpoints).toHaveLength(2);
    expect(setpoints[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') });
    expect(setpoints[1]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-01T02:00:00Z'), isVirtual: true });

    const setpoints2 = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: { ...schedule, endsAt: '2022-01-01T03:00:00Z' },
      startDateTime,
      endDateTime,
      isEditing: false,
    });
    expect(setpoints2).toHaveLength(3);
    expect(setpoints2[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') });
    expect(setpoints2[1]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-01T02:00:00Z') });
    expect(setpoints2[2]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-01T03:00:00Z'), isVirtual: true });

    const setpoints3 = repeatInterval({
      rulesOrActions: schedule.actions,
      alertRuleOrSchedule: { ...schedule, endsAt: '2022-01-02T00:59:00Z' },
      startDateTime,
      endDateTime,
      isEditing: false,
    });
    expect(setpoints3).toHaveLength(4);
    expect(setpoints3[0]).toEqual({ ...schedule.actions[0], time: new Date('2022-01-01T01:00:00Z') });
    expect(setpoints3[1]).toEqual({ ...schedule.actions[1], time: new Date('2022-01-01T02:00:00Z') });
    expect(setpoints3[2]).toEqual({ ...schedule.actions[2], time: new Date('2022-01-01T03:00:00Z') });
    expect(setpoints3[3]).toEqual({ ...schedule.actions[2], time: new Date('2022-01-02T00:59:00Z'), isVirtual: true });
  });
});
