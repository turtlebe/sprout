import { mockSkus, mockSkuTypes } from '../../../common/test-helpers';

import { canShowCaseQuantityPerPallet } from '.';

describe('canShowCaseQuantityPerPallet', () => {
  it('returns true', () => {
    // sku has package type "case" so should allow showing brand
    expect(canShowCaseQuantityPerPallet(mockSkus[3].skuTypeName, mockSkuTypes)).toBe(true);
  });

  it('returns false', () => {
    // sku has package type "bulk" so should not allow showing brand
    expect(canShowCaseQuantityPerPallet(mockSkus[2].skuTypeName, mockSkuTypes)).toBe(false);

    // sku has package type "clamshell" so should not allow showing brand
    expect(canShowCaseQuantityPerPallet(mockSkus[0].skuTypeName, mockSkuTypes)).toBe(false);
  });
});
