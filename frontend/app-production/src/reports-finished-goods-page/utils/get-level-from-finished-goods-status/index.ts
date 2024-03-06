import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

import { FinishedGoodsStatus } from '../../types';

const statusLabelConfig: Record<FinishedGoodsStatus, StatusLabelLevel> = {
  [FinishedGoodsStatus.EXPIRED]: StatusLabelLevel.FAILED,
  [FinishedGoodsStatus.RELEASED]: StatusLabelLevel.SUCCESS,
  [FinishedGoodsStatus.HOLD]: StatusLabelLevel.PENDING,
  [FinishedGoodsStatus.UNRELEASED]: StatusLabelLevel.IDLE,
};

export const getLevelFromFinishedGoodsStatus = (finishedGoodsStatus: FinishedGoodsStatus): StatusLabelLevel => {
  return statusLabelConfig[finishedGoodsStatus];
};
