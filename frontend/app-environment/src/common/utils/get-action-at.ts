import { Action, Schedule } from '@plentyag/core/src/types/environment';

import { getCurrentAndNextPoints } from './get-current-and-next-points';
import { getSecondsSinceIntervalStart } from './get-seconds-since-interval-start';

// @todo: handle linear interpolation after drubio PR is merged + add tests.
export function getActionAt(schedule: Schedule, at: Date): Action {
  const secondsSinceIntervalStart = getSecondsSinceIntervalStart(schedule, at);

  if (!secondsSinceIntervalStart) {
    return null;
  }

  const currentAndNext = getCurrentAndNextPoints({
    repeatInterval: schedule.repeatInterval,
    points: schedule.actions,
    secondsSinceIntervalStart,
  });

  if (!currentAndNext) {
    return null;
  }

  return currentAndNext.left;
}
