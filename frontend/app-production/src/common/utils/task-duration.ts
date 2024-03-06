import { getLuxonDateTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

import { DurativeTaskState } from '../../common/types';

export function taskDuration(task: DurativeTaskState) {
  return DateTime.now().diff(getLuxonDateTime(task.createdAt));
}
