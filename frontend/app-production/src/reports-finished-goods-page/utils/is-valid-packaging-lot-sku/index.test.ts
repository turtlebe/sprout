import { isValidPackagingLotSku } from '.';

describe('isValidPackagingLotSku', () => {
  it('returns true on a valid Sku', () => {
    // ARRANGE
    const validSku = {
      allowedCropNames: ['BAC'],
      brandTypeName: 'Plenty',
      caseQuantityPerPallet: null,
      childSkuName: 'BACClamshell4o5ozPlenty4.5oz',
      defaultCropName: null,
      description: null,
      displayAbbreviation: 'BACCase6Clamshell4o5ozPlenty4.5oz',
      displayName: 'BAC Case6Clamshell4o5oz Plenty 4.5oz',
      externalExpirationDays: 10,
      gtin: '10810567030436',
      internalExpirationDays: 5,
      kind: 'sku',
      labelPrimaryColor: '#861F41',
      labelSecondaryColor: '#FFBAC7',
      name: 'BACCase6Clamshell4o5ozPlenty4.5oz',
      netsuiteItem: '5-005-0004-06',
      packagingLotCropCode: 'BAC',
      path: 'skus/BACCase6Clamshell4o5ozPlenty4.5oz',
      productName: 'Baby Arugula',
      productWeightOz: 4.5,
      properties: {
        empty: null,
      },
      skuTypeName: 'Case6Clamshell4o5oz',
    };

    // ACT
    const result = isValidPackagingLotSku(validSku);

    // ASSERT
    expect(result).toBeTruthy();
  });

  it('returns false on an invalid Sku (old outdated sku)', () => {
    // ARRANGE
    const invalidSkuMissingProductWeight = {
      allowedCropNames: ['C11'],
      childSkuName: 'C11Clamshell4o5oz',
      defaultCropName: 'C11',
      description: null,
      displayAbbreviation: 'C11Case6Clamshell4o5oz',
      displayName: 'Sweet Sunrise 6ct Case of Clamshells 4.5oz',
      externalExpirationDays: 10,
      gtin: '10810567030429',
      internalExpirationDays: 4,
      kind: 'sku',
      labelPrimaryColor: '#FED141',
      labelSecondaryColor: '#D50032',
      name: 'C11Case6Clamshell4o5oz',
      netsuiteItem: '5-003-0004-06',
      packagingLotCropCode: 'C11',
      path: 'skus/C11Case6Clamshell4o5oz',
      productName: 'Sweet Sunrise',
      properties: {},
      skuTypeName: 'Case6Clamshell4o5oz',
    };

    // ACT
    const result = isValidPackagingLotSku(invalidSkuMissingProductWeight);

    // ASSERT
    expect(result).toBeFalsy();
  });
});
