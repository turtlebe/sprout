import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot, PackagingLotTestStatus, ReleaseDetails } from '@plentyag/core/src/types';
import { pick } from 'lodash';

/**
 * Utility function to return release details
 * - If this is a sku, then return sku release details
 * - Otherwise just return release details from lot properties
 * @param {PackagingLot} lot
 * @param {FarmDefSku} sku
 * @returns {ReleaseDetails}
 */
export const getReleaseDetails = (lot: PackagingLot, sku?: FarmDefSku): ReleaseDetails => {
  if (!lot?.properties) {
    return null;
  }

  const releaseDetails = sku
    ? lot.properties?.skuReleaseDetails?.find(item => item.nsItem === sku.netsuiteItem)
    : lot.properties;

  if (!releaseDetails) {
    return {
      passedLtStatus: PackagingLotTestStatus.NONE,
      passedQaStatus: PackagingLotTestStatus.NONE,
      overriddenLtStatus: PackagingLotTestStatus.NONE,
      overriddenQaStatus: PackagingLotTestStatus.NONE,
    };
  }

  return pick(releaseDetails, [
    'passedLtStatus',
    'passedQaStatus',
    'overriddenLtStatus',
    'overriddenLtAuthor',
    'overriddenLtNotes',
    'overriddenLtUpdatedAt',
    'overriddenQaStatus',
    'overriddenQaAuthor',
    'overriddenQaNotes',
    'overriddenQaUpdatedAt',
    'releasedAt',
  ]);
};
