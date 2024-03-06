import { mockSkus } from '../../common/test-helpers/mock-crops-skus';

import { getAllowedCropToPackagingLotCropCodesMapping } from './get-allowed-crop-to-packaging-lot-crop-codes-mapping';

describe('getAllowedCropToPackagingLotCropCodesMapping()', () => {
  it('will throw exception if bad argument passed', () => {
    expect(() => getAllowedCropToPackagingLotCropCodesMapping(undefined)).toThrow();
  });

  it('will return no mappings, if no skus passed', () => {
    const allowedToPackagingLotCropsMapping = getAllowedCropToPackagingLotCropCodesMapping([]);
    expect(allowedToPackagingLotCropsMapping.size).toBe(0);
  });

  it('will return mapping if there are allowed crops mapping exist', () => {
    const allowedToPackagingLotCropsMapping = getAllowedCropToPackagingLotCropCodesMapping(mockSkus);
    expect(allowedToPackagingLotCropsMapping).toEqual(
      new Map([
        ['B11', ['B11']],
        ['B20', ['B20']],
        ['WHC', ['B11']],
        ['CRC', ['CRS']],
        ['CRS', ['CRS']],
        ['BAC', ['B20']],
      ])
    );
  });
});
