import { TaskStatus, WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

export function isTaskRunning(task: WorkcenterTaskDetailsResponse) {
  const taskStatus = task?.executionDetails?.taskStatus;
  return taskStatus === TaskStatus.RUNNING || taskStatus === TaskStatus.QUEUED || taskStatus === TaskStatus.CANCELLING;
}
