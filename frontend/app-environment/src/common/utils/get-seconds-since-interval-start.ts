import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';
import moment from 'moment';

/**
 * Returns how many seconds elapsed since the AlertRule started and `at` time.
 */
export function getSecondsSinceIntervalStart(alertRuleOrSchedule: AlertRule | Schedule, at: Date): number {
  if (!alertRuleOrSchedule || !alertRuleOrSchedule.repeatInterval || !at) {
    return null;
  }

  const secondsSinceStartsAt = moment.duration(moment(at).diff(alertRuleOrSchedule.startsAt)).as('seconds');

  return secondsSinceStartsAt % alertRuleOrSchedule.repeatInterval;
}
