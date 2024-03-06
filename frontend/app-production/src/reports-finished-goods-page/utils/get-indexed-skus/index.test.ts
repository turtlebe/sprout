import { mockSku, mockSkuB10 } from '../../test-helpers/mock-skus';

import { getIndexedSkus } from '.';

describe('getIndexedSkus', () => {
  it('returns skus record indexed by crop name', () => {
    // ACT
    const result = getIndexedSkus([mockSku, mockSkuB10]);

    // ASSERT
    expect(result).toEqual({
      C11: [mockSku],
      B10: [mockSkuB10],
    });
  });
});
