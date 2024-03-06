import {
  mockFinishedGoodCasesCrop,
  mockFinishedGoodCasesSku,
} from '@plentyag/core/src/test-helpers/mocks/finished-good-cases';

import { getIndexedFinishedGoodCases } from '.';

describe('getIndexedFinishedGoodCases', () => {
  it('returns finished good cases record indexed by crop name', () => {
    // ACT
    const result = getIndexedFinishedGoodCases([mockFinishedGoodCasesSku, mockFinishedGoodCasesCrop]);

    // ASSERT
    expect(result).toEqual({
      skus: {
        C11Case6Clamshell4o5oz: [mockFinishedGoodCasesSku],
      },
      crops: {
        BRN: [mockFinishedGoodCasesCrop],
      },
      lots: {
        '5-LAX1-C11-219': [mockFinishedGoodCasesSku],
      },
    });
  });
});
