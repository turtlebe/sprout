import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';

export const mockCrop: FarmDefCrop = {
  childCrops: [
    {
      allowedCropNames: ['CRC'],
      defaultCropName: 'CRC',
      maxRatio: 1.0,
      minRatio: 0.0,
      targetRatio: null,
    },
    {
      allowedCropNames: ['GFF:NPI'],
      defaultCropName: 'GFF:NPI',
      maxRatio: 1.0,
      minRatio: 0.0,
      targetRatio: null,
    },
    {
      allowedCropNames: ['GRC'],
      defaultCropName: 'GRC',
      maxRatio: 1.0,
      minRatio: 0.0,
      targetRatio: null,
    },
    {
      allowedCropNames: ['BBB:NPI'],
      defaultCropName: 'BBB:NPI',
      maxRatio: 1.0,
      minRatio: 0.0,
      targetRatio: null,
    },
  ],
  commonName: 'Unbeetable Blend (AKA Sweet Sunrise)',
  cropTypeName: 'LeafyGreens',
  cultivar: null,
  description: null,
  displayAbbreviation: 'C11',
  displayName: 'Unbeetable Blend (AKA Sweet Sunrise) - C11',
  isSeedable: false,
  media: '',
  name: 'C11',
  path: 'crops/C11',
  properties: {
    plannedGrowDays: 12,
  },
  seedPartNumbers: [],
};

export const mockCropB10: FarmDefCrop = {
  childCrops: [],
  commonName: 'Baby Kale',
  cropTypeName: 'LeafyGreens',
  cultivar: 'Blue Vates Kale',
  description: null,
  displayAbbreviation: 'B10',
  displayName: 'Baby Kale - B10 - Blue Vates Kale',
  isSeedable: true,
  media: null,
  name: 'B10',
  path: 'crops/B10',
  properties: {
    scientificName: 'Brassica oleracea',
  },
  seedPartNumbers: [],
};

export const mockCropBRN: FarmDefCrop = {
  childCrops: [],
  commonName: 'Breen',
  cropTypeName: 'LeafyGreens',
  cultivar: 'Mini Head Romaine',
  description: null,
  displayAbbreviation: 'BRN',
  displayName: 'Breen - BRN - Mini Head Romaine - coir',
  isSeedable: true,
  media: 'coir',
  name: 'BRN',
  path: 'crops/BRN',
  properties: {
    plannedGrowDays: 12,
    scientificName: 'Lactuca sativa',
  },
  seedPartNumbers: [],
};

export const mockCrops: FarmDefCrop[] = [mockCrop, mockCropB10, mockCropBRN];
