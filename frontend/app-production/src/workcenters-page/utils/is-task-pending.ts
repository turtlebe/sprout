import { TaskStatus, WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

export function isTaskPending(task: WorkcenterTaskDetailsResponse) {
  return task?.executionDetails?.taskStatus === TaskStatus.CREATED;
}
