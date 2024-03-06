import { GrowConfigurationType } from '@plentyag/app-crops-skus/src/common/types';
import { ChildCrop } from '@plentyag/core/src/farm-def/types';
import { cloneDeep } from 'lodash';

import { EditCropFormikValues } from '../../types';

import { getUpdatedChildCrops } from '.';

const editCropsValues: EditCropFormikValues = {
  name: 'SMB',
  commonName: 'Spring Mix',
  media: '',
  cropTypeName: '',
  trialDescription: '',
  cultivar: '',
  scientificName: '',
  farms: [],
  growConfiguration: GrowConfigurationType.isBlendedAtBlendingMachine,
  childCrops: [
    { defaultCropName: 'GRC', allowedCropNames: ['GRC'], targetRatio: 0.5, minRatio: 0, maxRatio: 0.4 },
    { defaultCropName: 'MSX', allowedCropNames: ['MSX:NPI'], targetRatio: 0.5, minRatio: 0, maxRatio: 1.0 },
  ],
};

const mockCurrentchildCrops: ChildCrop[] = [
  { defaultCropName: 'GRC', allowedCropNames: ['GRC'], targetRatio: 1.0, minRatio: 0, maxRatio: 1.0 },
];

describe('getUpdatedChildCrops', () => {
  it('returns no childCrops when edited crop has no associated farms', () => {
    expect(getUpdatedChildCrops(mockCurrentchildCrops, editCropsValues)).toEqual([]);
  });

  it('returns no childCrops when edited crop is not a blended crop', () => {
    const _editCropValues = cloneDeep(editCropsValues);
    _editCropValues.farms = ['sites/SSF2/farms/Tigris '];
    _editCropValues.growConfiguration = GrowConfigurationType.isNotSeededOrBlended;

    expect(getUpdatedChildCrops(mockCurrentchildCrops, _editCropValues)).toEqual([]);
  });

  it('returns existing childCrops value when crop is blended at seeding machine', () => {
    const _editCropValues = cloneDeep(editCropsValues);
    _editCropValues.farms = ['sites/SSF2/farms/Tigris '];
    _editCropValues.growConfiguration = GrowConfigurationType.isBlendedAtSeedingMachine;

    expect(getUpdatedChildCrops(mockCurrentchildCrops, _editCropValues)).toEqual(mockCurrentchildCrops);
  });

  it('returns edited childCrops value when crop is blended at blending machine', () => {
    const _editCropValues = cloneDeep(editCropsValues);
    _editCropValues.farms = ['sites/SSF2/farms/Tigris '];
    _editCropValues.growConfiguration = GrowConfigurationType.isBlendedAtBlendingMachine;

    const editedChildCrops = [
      { defaultCropName: 'GRC', allowedCropNames: ['GRC'], targetRatio: 0.5, minRatio: 0, maxRatio: 1.0 },
      { defaultCropName: 'MSX', allowedCropNames: ['MSX:NPI', 'MSX'], targetRatio: 0.5, minRatio: 0, maxRatio: 1.0 },
    ];

    expect(getUpdatedChildCrops(mockCurrentchildCrops, _editCropValues)).toEqual(editedChildCrops);
  });
});
