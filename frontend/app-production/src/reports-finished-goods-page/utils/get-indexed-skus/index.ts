import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot } from '@plentyag/core/src/types';

export type GetIndexedSkusReturn = Record<PackagingLot['product'], FarmDefSku[]>;

/**
 * Converts skus from an array to an indexed record of skus by crop name
 * @param {FarmDefSku[]} skus
 * @returns {GetIndexedSkusReturn}
 */
export const getIndexedSkus = (skus: FarmDefSku[]): GetIndexedSkusReturn =>
  skus?.length > 0
    ? skus.reduce((acc, sku) => {
        const { packagingLotCropCode } = sku;

        acc[packagingLotCropCode] = acc[packagingLotCropCode] || [];
        acc[packagingLotCropCode].push(sku);

        return acc;
      }, {})
    : {};
