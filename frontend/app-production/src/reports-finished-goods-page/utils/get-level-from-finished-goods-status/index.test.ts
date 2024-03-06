import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

import { FinishedGoodsStatus } from '../../types';

import { getLevelFromFinishedGoodsStatus } from '.';

describe('getLevelFromFinishedGoodsStatus', () => {
  it.each([
    [StatusLabelLevel.FAILED, FinishedGoodsStatus.EXPIRED],
    [StatusLabelLevel.SUCCESS, FinishedGoodsStatus.RELEASED],
    [StatusLabelLevel.PENDING, FinishedGoodsStatus.HOLD],
    [StatusLabelLevel.IDLE, FinishedGoodsStatus.UNRELEASED],
  ])('shows level %s for finished goods %s status', (level, status) => {
    // ACT
    const result = getLevelFromFinishedGoodsStatus(status);

    // ASSERT
    expect(result).toEqual(level);
  });
});
