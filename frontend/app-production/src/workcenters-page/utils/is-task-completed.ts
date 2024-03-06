import { TaskStatus, WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

export function isTaskCompleted(task: WorkcenterTaskDetailsResponse) {
  const taskStatus = task?.executionDetails?.taskStatus;
  return taskStatus === TaskStatus.COMPLETED || taskStatus === TaskStatus.FAILED || taskStatus === TaskStatus.CANCELED;
}
