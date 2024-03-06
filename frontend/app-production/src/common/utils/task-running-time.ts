import { DurativeTaskState } from '../../common/types';

import { taskDuration } from './task-duration';

export function taskRunningTime(task: DurativeTaskState) {
  const dur = taskDuration(task);
  const days = dur.as('days');
  // if duration is less than a day then display in hh:mm:ss, otherwise just show days.
  return days > 1 ? `${Math.trunc(days)}+ days` : dur.toFormat('hh:mm:ss');
}
