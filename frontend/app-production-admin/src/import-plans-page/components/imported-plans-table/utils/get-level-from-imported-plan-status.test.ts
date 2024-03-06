import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

import { UploadHistoryEntry, UploadHistoryProcessingStatus } from '../../../types';

import { getLevelFromImportedPlanStatus } from './get-level-from-imported-plan-status';

describe('getLevelFromImportedPlanStatus', () => {
  it.each([
    [StatusLabelLevel.FAILED, UploadHistoryProcessingStatus.ERROR_CREATING_TASKS],
    [StatusLabelLevel.FAILED, UploadHistoryProcessingStatus.VALIDATION_FAILED],
    [StatusLabelLevel.SUCCESS, UploadHistoryProcessingStatus.CREATED_SUCCESSFULLY],
    [StatusLabelLevel.PROGRESSING, UploadHistoryProcessingStatus.AWAITING_CONFIRMATION],
    [StatusLabelLevel.PENDING, UploadHistoryProcessingStatus.CONFIRMED_CREATE_TASKS],
  ])('should return %s for status %s', (level, status: UploadHistoryEntry['status']) => {
    // ACT
    const result = getLevelFromImportedPlanStatus(status);

    // ASSERT
    expect(result).toEqual(level);
  });
});
