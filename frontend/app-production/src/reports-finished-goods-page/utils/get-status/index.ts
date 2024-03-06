import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot, PackagingLotTestStatus as Status } from '@plentyag/core/src/types';
import { getBestByDateFromLotAndSku } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

import { FinishedGoodsStatus } from '../../types';
import { getReleaseDetails } from '../get-release-details';

export const getStatus = (lot: PackagingLot, sku: FarmDefSku, isSkuLevel?: boolean): FinishedGoodsStatus => {
  const expDate = getBestByDateFromLotAndSku(lot, sku);
  const releaseDetails = getReleaseDetails(lot, isSkuLevel && sku);

  const nowDateTime = DateTime.now();
  const expDateTime = DateTime.fromJSDate(expDate);

  const isExpired = nowDateTime.hasSame(expDateTime, 'day') || nowDateTime.startOf('day') > expDateTime.startOf('day');
  const isReleased = Boolean(releaseDetails.releasedAt);
  const isOnHold =
    releaseDetails.overriddenQaStatus === Status.HOLD ||
    releaseDetails.overriddenLtStatus === Status.HOLD ||
    (releaseDetails.overriddenQaStatus === Status.NONE && releaseDetails.passedQaStatus === Status.HOLD) ||
    (releaseDetails.overriddenLtStatus === Status.NONE && releaseDetails.passedLtStatus === Status.HOLD);

  return isReleased
    ? FinishedGoodsStatus.RELEASED
    : isExpired
    ? FinishedGoodsStatus.EXPIRED
    : isOnHold
    ? FinishedGoodsStatus.HOLD
    : FinishedGoodsStatus.UNRELEASED;
};
