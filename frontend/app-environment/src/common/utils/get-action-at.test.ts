import { DateTime } from 'luxon';

import { buildSchedule } from '../test-helpers';

import { getActionAt } from './get-action-at';

const schedule = buildSchedule({
  startsAt: '2023-01-01T00:00:00Z',
  activatesAt: '2023-01-01T00:00:00Z',
  actions: [
    { time: 0, valueType: 'SINGLE_VALUE', value: '10' },
    { time: 3600, valueType: 'SINGLE_VALUE', value: '20' },
  ],
});

describe('getActionAt', () => {
  it('returns null', () => {
    expect(getActionAt(null, new Date())).toBeNull();
    expect(getActionAt(schedule, null)).toBeNull();
    expect(getActionAt({ ...schedule, actions: [] }, new Date())).toBeNull();
  });

  it('returns the 1st action', () => {
    expect(getActionAt(schedule, DateTime.fromISO(schedule.startsAt).plus({ minute: 1 }).toJSDate())).toEqual(
      schedule.actions[0]
    );
  });

  it('returns the 2nd action', () => {
    expect(getActionAt(schedule, DateTime.fromISO(schedule.startsAt).plus({ hour: 1 }).toJSDate())).toEqual(
      schedule.actions[1]
    );
  });
});
