import { WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

export function getTaskParamsFromTaskInstance(task: WorkcenterTaskDetailsResponse) {
  return task?.executionDetails?.taskInstance?.taskParams;
}
