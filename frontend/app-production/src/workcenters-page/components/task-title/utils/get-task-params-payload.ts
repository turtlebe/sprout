import { WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

export function getTaskParamsPayload(task: WorkcenterTaskDetailsResponse) {
  return task?.taskDetails?.taskParametersJsonPayload && JSON.parse(task?.taskDetails?.taskParametersJsonPayload);
}
