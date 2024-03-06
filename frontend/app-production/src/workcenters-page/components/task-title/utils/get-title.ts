import { WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

import { isTaskPending, isTaskRunning } from '../../../utils';

interface TitleStates {
  pending: string;
  running: string;
  completed: string;
}

export function getTitle(task: WorkcenterTaskDetailsResponse, title: TitleStates) {
  return isTaskPending(task) ? title.pending : isTaskRunning(task) ? title.running : title.completed;
}
