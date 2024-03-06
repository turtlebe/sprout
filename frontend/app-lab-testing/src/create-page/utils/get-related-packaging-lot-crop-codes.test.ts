import { getRelatedPackagingLotCropCodes } from './get-related-packaging-lot-crop-codes';

const emptyMap = new Map();

/**
 * Mapping (https://plentyag.atlassian.net/browse/SD-6639):
 * GRF + CRS = C20
 * C20 + C30 = C11
 * E20 + E40 = E31
 */
const childToParentCropsMapping = new Map([
  ['GRF', ['C20']],
  ['CRS', ['C20']],
  ['C20', ['C11']],
  ['C30', ['C11']],
  ['E20', ['E31']],
  ['E40', ['E31']],
]);

const allowedCropToPackagingLotCropCodesMapping = new Map([
  ['C20', ['C20LOT']],
  ['C11', ['C11LOT']],
  ['GRF', ['GRFLOT']],
  ['E31', ['E31LOT']],
  ['WHC', ['B11']],
]);

describe('getRelatedPackagingLotCropCodes', () => {
  it('returns no packaging lot crop codes, since there is no mapping found', () => {
    const packagingLotCropCodes = getRelatedPackagingLotCropCodes(['C20'], emptyMap, emptyMap);
    expect(packagingLotCropCodes).toHaveLength(0);
  });
  it('returns two items since there is a recursive child to parent mapping for C20 crop', () => {
    const packagingLotCropCodes = getRelatedPackagingLotCropCodes(
      ['C20'],
      childToParentCropsMapping,
      allowedCropToPackagingLotCropCodesMapping
    );
    expect(packagingLotCropCodes).toHaveLength(2);
    expect(packagingLotCropCodes[0]).toBe('C11LOT');
    expect(packagingLotCropCodes[1]).toBe('C20LOT');
  });
  it('returns three items since there is a recursive child to parent mapping for GRF crop', () => {
    const packagingLotCropCodes = getRelatedPackagingLotCropCodes(
      ['GRF'],
      childToParentCropsMapping,
      allowedCropToPackagingLotCropCodesMapping
    );
    expect(packagingLotCropCodes).toHaveLength(3);
    expect(packagingLotCropCodes[0]).toBe('C11LOT');
    expect(packagingLotCropCodes[1]).toBe('C20LOT');
    expect(packagingLotCropCodes[2]).toBe('GRFLOT');
  });
  it('returns one item since there is one child to parent mapping for E40 crop', () => {
    const packagingLotCropCodes = getRelatedPackagingLotCropCodes(
      ['E40'],
      childToParentCropsMapping,
      allowedCropToPackagingLotCropCodesMapping
    );
    expect(packagingLotCropCodes).toHaveLength(1);
    expect(packagingLotCropCodes[0]).toBe('E31LOT');
  });
  it('returns one item since only allowed crop to packaging lot crop codes mapping for WHC crop exists', () => {
    const packagingLotCropCodes = getRelatedPackagingLotCropCodes(
      ['WHC'],
      childToParentCropsMapping,
      allowedCropToPackagingLotCropCodesMapping
    );
    expect(packagingLotCropCodes).toHaveLength(1);
    expect(packagingLotCropCodes[0]).toBe('B11');
  });
});
