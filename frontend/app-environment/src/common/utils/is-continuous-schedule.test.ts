import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { ScheduleType } from '@plentyag/core/src/types/environment';

const [schedule] = mockSchedules;

import { isContinuousSchedule } from './is-continuous-schedule';

describe('isContinuousSchedule', () => {
  it('returns true', () => {
    expect(isContinuousSchedule(schedule)).toBe(true);
  });

  it('returns false', () => {
    expect(isContinuousSchedule({ ...schedule, scheduleType: ScheduleType.EVENT })).toBe(false);
  });
});
