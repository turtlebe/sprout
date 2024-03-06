import {
  mockFinishedGoodCasesSku,
  mockFinishedGoodsCases,
  mockPackagingLot,
} from '@plentyag/core/src/test-helpers/mocks';

import { mockSku } from '../../test-helpers/mock-skus';
import { getIndexedFinishedGoodCases } from '../get-indexed-finished-goods-cases';

import { getCasesByLotAndNsi } from '.';

describe('getCasesByLotAndNsi', () => {
  it('retuns filtered list of cases by lot and sku ', () => {
    // ARRANGE
    const mockCasesByLot = getIndexedFinishedGoodCases(mockFinishedGoodsCases).lots;

    // ACT
    const result = getCasesByLotAndNsi(mockCasesByLot, mockPackagingLot, mockSku);

    // ASSERT
    expect(result).toEqual([mockFinishedGoodCasesSku]);
  });
});
