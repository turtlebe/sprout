import { getIntervalStartWithoutDst } from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';
import moment from 'moment';

export function getDurationInSeconds(startsAt: string, date: Date, additionalDays: number) {
  const mStartsAt = moment(startsAt);

  const mNewDate = moment(date)
    .startOf('minute')
    .year(mStartsAt.year())
    .month(mStartsAt.month())
    .date(mStartsAt.date());

  const duration = moment.duration(mNewDate.diff(mStartsAt)).as('seconds');

  // A negative duration means we are before the the begining of the interval (0).
  // This means, the duration is relative to the end the interval.
  // Note: even if an AlertRule has an interval that spans accross multiple days, the context of how
  // this function is used is always scoped to 24 hours.
  if (duration < 0) {
    return ONE_DAY + duration + additionalDays * ONE_DAY;
  }

  return duration + additionalDays * ONE_DAY;
}

export function getDurationInSecondsWith(
  alertRuleOrSchedule: AlertRule | Schedule,
  date: Date,
  additionalDays: number
) {
  const mStartsAt = getIntervalStartWithoutDst(alertRuleOrSchedule);

  const mNewDate = moment(date)
    .startOf('minute')
    .year(mStartsAt.year())
    .month(mStartsAt.month())
    .date(mStartsAt.date());

  const duration = moment.duration(mNewDate.diff(mStartsAt)).as('seconds');

  // A negative duration means we are before the the begining of the interval (0).
  // This means, the duration is relative to the end the interval.
  // Note: even if an AlertRule has an interval that spans accross multiple days, the context of how
  // this function is used is always scoped to 24 hours.
  if (duration < 0) {
    return ONE_DAY + duration + additionalDays * ONE_DAY;
  }

  return duration + additionalDays * ONE_DAY;
}
