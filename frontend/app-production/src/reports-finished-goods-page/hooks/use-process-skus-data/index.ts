import { FarmDefCrop, FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot, ReleaseDetails } from '@plentyag/core/src/types';
import { getBestByDateFromLotAndSku } from '@plentyag/core/src/utils';
import { orderBy } from 'lodash';
import { useMemo } from 'react';

import { FinishedGoodsData, FinishedGoodsStatus } from '../../types';
import {
  getCasesByLotAndNsi,
  getIndexedCrops,
  GetIndexedCropsReturn,
  getIndexedFinishedGoodCases,
  GetIndexedFinishedGoodCasesReturn,
  getIndexedSkus,
  GetIndexedSkusReturn,
  getStatus,
} from '../../utils';
import { getProductFromLot } from '../../utils/get-product-from-lot';
import { getReleaseDetails } from '../../utils/get-release-details';

export interface UseProcessSkusData {
  finishedGoodsData: FinishedGoodsData;
}

export interface SkuObj {
  nodeId: string;
  sku: FarmDefSku;
  lot: PackagingLot;
  status: FinishedGoodsStatus;
  count: number;
  crop: FarmDefCrop;
  expDate: Date;
  releaseDetails?: ReleaseDetails;
}

export const useProcessSkusData = ({ finishedGoodsData }: UseProcessSkusData): SkuObj[] => {
  // Data
  const { lots, crops, cases, skus } = finishedGoodsData;

  // Index sup. data
  const skusRecordIndex = useMemo<GetIndexedSkusReturn>(() => getIndexedSkus(skus), [skus]);
  const cropsRecordIndex = useMemo<GetIndexedCropsReturn>(() => getIndexedCrops(crops), [crops]);
  const casesRecordIndex = useMemo<GetIndexedFinishedGoodCasesReturn>(
    () => getIndexedFinishedGoodCases(cases),
    [cases]
  );

  // Pre sort by pack date by default
  const preSortedLots = useMemo<PackagingLot[]>(() => orderBy(lots, 'properties.packDate', 'desc'), [lots]); // Pre sort by date by default

  // Process each lot with more info
  const data = useMemo<SkuObj[]>(
    () =>
      (preSortedLots || []).reduce((acc, lot) => {
        // get skus
        const lotSkus = skusRecordIndex[getProductFromLot(lot)];

        // -- if no skus, skip
        if (!lotSkus || lotSkus.length < 1) {
          return acc;
        }

        // get crops
        const crop = cropsRecordIndex[getProductFromLot(lot)];

        // loop through skus
        const addSkuItems = lotSkus.map(sku => {
          // figure out expired date
          const expDate = getBestByDateFromLotAndSku(lot, sku);

          // figure out status
          const status = getStatus(lot, sku, true);

          // figure out count
          const count = getCasesByLotAndNsi(casesRecordIndex.lots, lot, sku).length;

          // figure out release details
          const releaseDetails = getReleaseDetails(lot, sku);

          // unique id
          const nodeId = `${lot.lotName}_${sku.name}`;

          return {
            nodeId,
            lot,
            sku,
            count,
            crop,
            expDate,
            status,
            releaseDetails,
          };
        });

        return [...acc, ...addSkuItems];
      }, []),
    [lots, cropsRecordIndex, skusRecordIndex]
  );

  return data;
};
