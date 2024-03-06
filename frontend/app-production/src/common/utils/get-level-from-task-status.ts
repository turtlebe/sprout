import { TaskStatus } from '@plentyag/app-production/src/common/types';
import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

const statusLabelConfig: Record<TaskStatus, StatusLabelLevel> = {
  [TaskStatus.CREATED]: StatusLabelLevel.IDLE,
  [TaskStatus.CANCELED]: StatusLabelLevel.PENDING,
  [TaskStatus.QUEUED]: StatusLabelLevel.PENDING,
  [TaskStatus.RUNNING]: StatusLabelLevel.PROGRESSING,
  [TaskStatus.CANCELLING]: StatusLabelLevel.PENDING,
  [TaskStatus.COMPLETED]: StatusLabelLevel.SUCCESS,
  [TaskStatus.FAILED]: StatusLabelLevel.FAILED,
};

export const getLevelFromTaskStatus = (taskStatus: TaskStatus): StatusLabelLevel => {
  return statusLabelConfig[taskStatus];
};
