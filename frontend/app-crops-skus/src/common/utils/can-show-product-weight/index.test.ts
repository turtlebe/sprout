import { mockSkus, mockSkuTypes } from '../../../common/test-helpers';

import { canShowProductWeight } from '.';

describe('canShowProductWeight', () => {
  it('returns true', () => {
    // sku has package type "clamshell" so should allow showing product weight
    expect(canShowProductWeight(mockSkus[0].skuTypeName, mockSkuTypes)).toBe(true);

    // sku has package type "bulk" so should allow showing product weight
    expect(canShowProductWeight(mockSkus[2].skuTypeName, mockSkuTypes)).toBe(true);

    // sku has package type "case" so should allow showing product weight
    expect(canShowProductWeight(mockSkus[3].skuTypeName, mockSkuTypes)).toBe(true);
  });
});
