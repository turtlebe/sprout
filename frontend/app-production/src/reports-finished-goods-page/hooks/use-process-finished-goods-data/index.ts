import { FarmDefCrop, FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot, ReleaseDetails } from '@plentyag/core/src/types';
import { getBestByDateFromLotAndSku } from '@plentyag/core/src/utils';
import { minBy, orderBy } from 'lodash';
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
import { getReleaseDetails } from '../../utils/get-release-details';

export interface UseProcessFinishedGoodsData {
  finishedGoodsData: FinishedGoodsData;
}

export interface SkusWithCount {
  sku: FarmDefSku;
  count: number;
}
export interface FinishedGoodsObj {
  nodeId: string;
  lot: PackagingLot;
  skus: SkusWithCount[];
  status: FinishedGoodsStatus;
  crop: FarmDefCrop;
  expDate: Date;
  releaseDetails: ReleaseDetails;
}

export const useProcessFinishedGoodsData = ({ finishedGoodsData }: UseProcessFinishedGoodsData): FinishedGoodsObj[] => {
  // Data
  const { lots, crops, cases, skus } = finishedGoodsData;

  // Index Skus
  const skusRecordIndex = useMemo<GetIndexedSkusReturn>(() => getIndexedSkus(skus), [skus]);
  const cropsRecordIndex = useMemo<GetIndexedCropsReturn>(() => getIndexedCrops(crops), [crops]);
  const casesRecordIndex = useMemo<GetIndexedFinishedGoodCasesReturn>(
    () => getIndexedFinishedGoodCases(cases),
    [cases]
  );

  // Pre sort by pack date by default
  const preSortedLots = useMemo<PackagingLot[]>(() => orderBy(lots, 'properties.packDate', 'desc'), [lots]); // Pre sort by date by default

  // Process each lot with more info
  const data = useMemo<FinishedGoodsObj[]>(
    () =>
      (preSortedLots || []).map(lot => {
        // get skus
        const lotSkus = skusRecordIndex[lot.product] || [];
        const skus = lotSkus.map(sku => {
          // figure out count
          const count = getCasesByLotAndNsi(casesRecordIndex.lots, lot, sku).length;

          return {
            sku,
            count,
          };
        });

        // get crop
        const crop = cropsRecordIndex[lot.product];

        // figure out expired date
        const soonestExpDaysSku = lotSkus && minBy(lotSkus, sku => sku.internalExpirationDays);
        const expDate = getBestByDateFromLotAndSku(lot, soonestExpDaysSku);

        // figure out status
        const status = getStatus(lot, soonestExpDaysSku);

        // figure out release details
        const releaseDetails = getReleaseDetails(lot);

        // unique id
        const nodeId = lot.id;

        return {
          nodeId,
          lot,
          skus,
          crop,
          expDate,
          status,
          releaseDetails,
        };
      }),
    [lots, cropsRecordIndex, skusRecordIndex]
  );

  return data;
};
