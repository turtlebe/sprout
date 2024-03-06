import { mockSchedules } from '@plentyag/core/src/test-helpers/mocks/environment';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

import { getScheduleTimeLabel } from './get-schedule-time-label';

const [mockSchedule] = mockSchedules;

describe('getScheduleTimeLabel', () => {
  it('returns null', () => {
    expect(getScheduleTimeLabel(null)).toBe(null);
    expect(getScheduleTimeLabel(undefined)).toBe(null);
  });

  it('returns when the schedule starts', () => {
    const schedule = { ...mockSchedule, endsAt: null };

    expect(getScheduleTimeLabel(schedule)).toBe(
      DateTime.fromISO(schedule.startsAt).toFormat(DateTimeFormat.US_DEFAULT)
    );
  });

  it('returns when the schedule starts and ends', () => {
    const schedule = { ...mockSchedule, endsAt: '2022-02-01T00:00:00Z' };

    expect(getScheduleTimeLabel(schedule)).toBe(
      `${DateTime.fromISO(schedule.startsAt).toFormat(DateTimeFormat.US_DEFAULT)} - ${DateTime.fromISO(
        schedule.endsAt
      ).toFormat(DateTimeFormat.US_DEFAULT)}`
    );
  });
});
