import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { isDstInInterval } from './is-dst-in-interval';

export function getIntervalStart(
  alertRuleOrSchedule: AlertRule | Schedule,
  from: Date,
  intervalDiff: number
): moment.Moment {
  const { startsAt, repeatInterval } = alertRuleOrSchedule;

  const secondsBetweenStartsAtTimeAndFrom = moment.duration(moment(from).diff(startsAt)).as('seconds');
  const intervalCountBetweenStartsAtAndFrom = Math.floor(Math.abs(secondsBetweenStartsAtTimeAndFrom) / repeatInterval);

  return moment(startsAt).add(repeatInterval * (intervalCountBetweenStartsAtAndFrom + intervalDiff), 'seconds');
}

/**
 * For a given AlertRule, returns the start of the interval prior to the interval we're currently at.
 *
 * Example:
 *
 * For an AlertRule that starts on 2022-01-01T00:00:00Z, and has a repeatInterval of 24 hours.
 * If the current time is 2022-01-05T10:00:00Z, then the current interval started at 2022-01-05T00:00:00Z,
 * and the previous interval started at 2022-01-04T00:00:00Z. This functions will return 2022-01-04T00:00:00Z.
 */
export function getPreviousIntervalStart(alertRuleOrSchedule: AlertRule | Schedule, from?: Date): moment.Moment {
  return getIntervalStart(alertRuleOrSchedule, from, -1);
}

/**
 * Return when an alert rule or schedule starts relative to a given date.
 *
 * This function handles ambiguity due to DST when the current time is during an interval where DST occurs:
 * - it returns the previous interval if DST hasn't happened yet.
 * - it returns the next interval if DST has happened.
 *
 * This is needed because during an interval with DST, we either have one less hour or one extra hour and this breaks calculating rules or
 * actions that are relative to the start time of their alert rule or schedule.
 *
 * @param alertRuleOrSchedule an Alert Rule or Schedule
 * @param currentTime the relative date to calculate when the interval started -
 *  most of the time we want to calculate when the interval start for the current time.
 * @returns a moment object representing when the interval starts.
 */
export function getIntervalStartWithoutDst(
  alertRuleOrSchedule: AlertRule | Schedule,
  currentTime = new Date()
): moment.Moment {
  const isTimeDst = moment(currentTime).isDST();
  const { isSpringTransition, isFallTransition } = isDstInInterval(alertRuleOrSchedule, currentTime);

  if (isSpringTransition) {
    return getIntervalStart(alertRuleOrSchedule, currentTime, isTimeDst ? 1 : -1);
  }

  if (isFallTransition) {
    return getIntervalStart(alertRuleOrSchedule, currentTime, isTimeDst ? -1 : 1);
  }

  return getIntervalStart(alertRuleOrSchedule, currentTime, 0);
}
