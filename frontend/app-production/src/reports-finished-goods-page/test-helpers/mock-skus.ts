import { SkusWithCount } from '../hooks';

export const mockSku = {
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
  productWeightOz: 4.5,
  properties: {},
  skuTypeName: 'Case6Clamshell4o5oz',
};

export const mockDupSkuWithoutProductWeight = {
  allowedCropNames: ['C11'],
  childSkuName: 'C11Clamshell4o5oz',
  defaultCropName: null,
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

export const mockSkuB10 = {
  allowedCropNames: ['BAC'],
  childSkuName: 'KC1Clamshell4o5oz',
  defaultCropName: null,
  description: null,
  displayAbbreviation: 'B10Case6Clamshell4o5oz',
  displayName: 'BAC Arugula Testing Oscar 6ct Case of Clamshells 4.5oz',
  externalExpirationDays: 11,
  gtin: '10810567030437',
  internalExpirationDays: 4,
  kind: 'sku',
  labelPrimaryColor: '#861F41',
  labelSecondaryColor: '#FFBAC7',
  name: 'B10Case6Clamshell4o5oz',
  netsuiteItem: '5-005-0004-07',
  packagingLotCropCode: 'B10',
  path: 'skus/B10Case6Clamshell4o5oz',
  productName: 'BAC Arugula Testing Oscar',
  productWeightOz: 4.5,
  properties: {},
  skuTypeName: 'Case6Clamshell4o5oz',
};

export const mockSkus = [mockSku, mockSkuB10];

export const mockSkusWithCount: SkusWithCount[] = [
  {
    count: 1,
    sku: mockSku,
  },
  {
    count: 3,
    sku: mockSkuB10,
  },
];
