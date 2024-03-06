import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

import { UploadHistoryEntry, UploadHistoryProcessingStatus } from '../../../types';

const statusLabelConfig: Record<UploadHistoryEntry['status'], StatusLabelLevel> = {
  [UploadHistoryProcessingStatus.AWAITING_CONFIRMATION]: StatusLabelLevel.PROGRESSING,
  [UploadHistoryProcessingStatus.CONFIRMED_CREATE_TASKS]: StatusLabelLevel.PENDING,
  [UploadHistoryProcessingStatus.ERROR_CREATING_TASKS]: StatusLabelLevel.FAILED,
  [UploadHistoryProcessingStatus.VALIDATION_FAILED]: StatusLabelLevel.FAILED,
  [UploadHistoryProcessingStatus.CREATED_SUCCESSFULLY]: StatusLabelLevel.SUCCESS,
};

export const getLevelFromImportedPlanStatus = (status: UploadHistoryEntry['status']): StatusLabelLevel => {
  return statusLabelConfig[status];
};
