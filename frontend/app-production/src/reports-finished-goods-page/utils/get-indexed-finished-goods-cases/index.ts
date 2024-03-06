import { FinishedGoodCase, FinishedGoodSkuProperties, FinishedGoodsPtiLabel } from '@plentyag/core/src/types';

export interface GetIndexedFinishedGoodCasesReturn {
  skus: Record<FinishedGoodSkuProperties['sku'], FinishedGoodCase[]>;
  crops: Record<FinishedGoodCase['product'], FinishedGoodCase[]>;
  lots: Record<FinishedGoodsPtiLabel['lot'], FinishedGoodCase[]>;
}

/**
 * Converts finished good cases to an indexed record with two main finished good case types: skus & crops
 * @param {FinishedGoodCase[]} cases
 * @returns {GetIndexedFinishedGoodCasesReturn}
 */
export const getIndexedFinishedGoodCases = (cases: FinishedGoodCase[]): GetIndexedFinishedGoodCasesReturn => {
  const emptyRecords = {
    skus: {},
    crops: {},
    lots: {},
  };

  if (!cases) {
    return emptyRecords;
  }

  return cases.reduce((acc, finishedGoodsCase) => {
    if ('sku' in finishedGoodsCase.properties) {
      const { sku } = finishedGoodsCase.properties;
      acc.skus[sku] = acc.skus[sku] || [];
      acc.skus[sku].push(finishedGoodsCase);
    } else {
      acc.crops[finishedGoodsCase.product] = acc.skus[finishedGoodsCase.product] || [];
      acc.crops[finishedGoodsCase.product].push(finishedGoodsCase);
    }

    if (
      'ptiLabelQrCodeContent' in finishedGoodsCase.properties &&
      finishedGoodsCase.properties.ptiLabelQrCodeContent?.lot
    ) {
      const { lot } = finishedGoodsCase.properties.ptiLabelQrCodeContent;
      acc.lots[lot] = acc.lots[lot] || [];
      acc.lots[lot].push(finishedGoodsCase);
    }

    return acc;
  }, emptyRecords);
};
