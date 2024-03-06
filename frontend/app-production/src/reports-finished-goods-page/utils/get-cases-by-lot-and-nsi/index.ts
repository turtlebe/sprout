import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { FinishedGoodCase, FinishedGoodsPtiLabel, PackagingLot } from '@plentyag/core/src/types';

/**
 * Return cases binding lot and skus by NetSuite Item
 *
 * @param {Record<FinishedGoodsPtiLabel['lot'], FinishedGoodCase[]>} casesByLot
 * @param {PackagingLot} lot
 * @param {FarmDefSku} sku
 * @returns {FinishedGoodCase[]}
 */
export const getCasesByLotAndNsi = (
  casesByLot: Record<FinishedGoodsPtiLabel['lot'], FinishedGoodCase[]>,
  lot: PackagingLot,
  sku: FarmDefSku
) =>
  casesByLot?.[lot.lotName]?.filter(
    finishedGoodCase =>
      'ptiLabelQrCodeContent' in finishedGoodCase.properties &&
      finishedGoodCase.properties.ptiLabelQrCodeContent.item === sku.netsuiteItem
  ) ?? [];
