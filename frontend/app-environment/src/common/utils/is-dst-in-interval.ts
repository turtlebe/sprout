import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { getIntervalStart } from './get-previous-interval-start';

export interface IsDstInIntervalReturn {
  isDstTransition: boolean;
  isSpringTransition: boolean;
  isFallTransition: boolean;
}

/**
 * For a given AlertRule or Schedule, returns if the interval for the given `time` has a DST transitions.
 *
 * The simplest way to know this is to calculate the current interval start and the next interval start.
 * - If the current interval start is not in DST but the next one is, this is the Spring DST transition.
 * - If the current interval start is in DST but the next one is not, this is the Fall DST transition.
 * - Otherwise DST is not happening during the interval for the given `time`.
 */
export function isDstInInterval(
  alertRuleOrSchedule: AlertRule | Schedule,
  time: Date,
  offset = 0
): IsDstInIntervalReturn {
  const currentIntervalStart = getIntervalStart(alertRuleOrSchedule, time, offset);
  const nextIntervalStart = getIntervalStart(alertRuleOrSchedule, time, 1 + offset);
  const isSpringTransition = !moment(currentIntervalStart).isDST() && moment(nextIntervalStart).isDST();
  const isFallTransition = moment(currentIntervalStart).isDST() && !moment(nextIntervalStart).isDST();

  return { isDstTransition: isSpringTransition || isFallTransition, isSpringTransition, isFallTransition };
}
