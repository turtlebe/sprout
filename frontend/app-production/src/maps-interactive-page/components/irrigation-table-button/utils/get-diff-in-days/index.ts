import { DateTime } from 'luxon';

export function getDiffInDays(time1: DateTime, time2: DateTime) {
  // using trunc here, since we're just concerned with the day integer and not decimals.
  return Math.trunc(time1.diff(time2, 'days').as('days'));
}
