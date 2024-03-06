import { CropWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';

export function createEmptyCrop(crops: CropWithFarmInfo[]) {
  const emptyCrop: CropWithFarmInfo = {
    name: undefined,
    commonName: undefined,
    displayName: undefined,
    displayAbbreviation: undefined,
    description: undefined,
    path: undefined,
    cropTypeName: undefined,
    isSeedable: undefined,
    media: undefined,
    cultivar: undefined,
    childCrops: [],
    seedPartNumbers: [],
    properties: {},
    hasFarm: {},
    skus: [],
  };
  if (crops?.length > 0) {
    // extract all farms from an existing crop and set each to false.
    const farms = Object.keys(crops[0].hasFarm);
    farms.forEach(farm => {
      emptyCrop.hasFarm[farm] = false;
    });
  }
  return emptyCrop;
}
