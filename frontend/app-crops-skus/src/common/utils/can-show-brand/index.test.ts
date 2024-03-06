import { mockSkus, mockSkuTypes } from '../../test-helpers';

import { canShowBrand } from '.';

describe('canShowBrand', () => {
  it('returns true', () => {
    // sku has package type "clamshell" so should allow showing brand
    expect(canShowBrand(mockSkus[0].skuTypeName, mockSkuTypes)).toBe(true);

    // sku has package type "case" so should allow showing brand
    expect(canShowBrand(mockSkus[3].skuTypeName, mockSkuTypes)).toBe(true);
  });

  it('returns false', () => {
    // sku has package type "bulk" so should not allow showing brand
    expect(canShowBrand(mockSkus[2].skuTypeName, mockSkuTypes)).toBe(false);
  });
});
