import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';

export type GetIndexedCropsReturn = Record<FarmDefCrop['name'], FarmDefCrop>;

/**
 * Converts crops from an array to an indexed record of crops by crop name
 * @param {FarmDefCrop[]} crops
 * @returns {GetIndexedCropsReturn}
 */
export const getIndexedCrops = (crops: FarmDefCrop[]): GetIndexedCropsReturn =>
  crops
    ? crops.reduce((acc, crop) => {
        acc[crop.name] = crop;
        return acc;
      }, {})
    : {};
