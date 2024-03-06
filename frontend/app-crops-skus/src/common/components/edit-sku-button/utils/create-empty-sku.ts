import { SkuWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';

export function createEmptySku(skus: SkuWithFarmInfo[]) {
  const emptySku: SkuWithFarmInfo = {
    name: undefined,
    kind: undefined,
    path: undefined,
    description: undefined,
    netsuiteItem: undefined,
    gtin: undefined,
    productName: undefined,
    displayName: undefined,
    displayAbbreviation: undefined,
    skuTypeName: undefined,
    packagingLotCropCode: undefined,
    defaultCropName: undefined,
    allowedCropNames: [],
    labelPrimaryColor: undefined,
    labelSecondaryColor: undefined,
    internalExpirationDays: undefined,
    externalExpirationDays: undefined,
    childSkuName: undefined,
    properties: {},
    hasFarm: {},
    packageImagery: undefined,
  };
  if (skus?.length > 0) {
    // extract all farms from an existing sku and set each to false.
    const farms = Object.keys(skus[0].hasFarm);
    farms.forEach(farm => {
      emptySku.hasFarm[farm] = false;
    });
  }
  return emptySku;
}
