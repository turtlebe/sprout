import { Schedule, ScheduleType } from '@plentyag/core/src/types/environment';

export function isContinuousSchedule(schedule: Schedule) {
  return Boolean(schedule.scheduleType === ScheduleType.CONTINUOUS);
}
