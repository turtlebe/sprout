import { Schedule } from '@plentyag/core/src/types/environment';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';

export function getScheduleTimeLabel(schedule: Schedule) {
  if (!schedule) {
    return null;
  }

  if (schedule.endsAt) {
    return `${getLuxonDateTime(schedule.startsAt).toFormat(DateTimeFormat.US_DEFAULT)} - ${getLuxonDateTime(
      schedule.endsAt
    ).toFormat(DateTimeFormat.US_DEFAULT)}`;
  }

  return getLuxonDateTime(schedule.startsAt).toFormat(DateTimeFormat.US_DEFAULT);
}
