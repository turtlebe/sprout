import { mockSkus } from '@plentyag/app-crops-skus/src/common/test-helpers';

import { getSkuProductWeight } from '.';

describe('getSkuProductWeight', () => {
  it('returns undefined when sku not found', () => {
    expect(getSkuProductWeight('bogus-sku', mockSkus)).toBeUndefined();
  });

  it('returns undefined when sku does not have productWeightOz', () => {
    expect(getSkuProductWeight('C11Bulk3lb', mockSkus)).toBeUndefined();
  });

  it('returns the productWeightOz field for the given sku name', () => {
    expect(getSkuProductWeight('B11Clamshell4o5oz', mockSkus)).toEqual(mockSkus[1].productWeightOz);
  });
});
