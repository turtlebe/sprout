import { mockCrops } from '@plentyag/app-crops-skus/src/common/test-helpers';
import { cloneDeep } from 'lodash';

import { getAllowedCropNames } from '.';

const farms = ['sites/SSF2/farms/Tigris', 'sites/LAX1/farms/LAX1'];

describe('getAllowedCropNames', () => {
  it('returns crops that are allowed', () => {
    const mockCropsTest = cloneDeep(mockCrops);
    mockCropsTest[0].hasFarm = {};
    mockCropsTest[2].isSeedable = false;
    expect(getAllowedCropNames(farms, mockCropsTest)).toEqual(['YCH']);
  });

  it('returns no allowed crops when farms is empty', () => {
    expect(getAllowedCropNames([], mockCrops)).toEqual([]);
  });

  it('returns no allowed crops when crops array is empty', () => {
    expect(getAllowedCropNames(farms, [])).toEqual([]);
  });
});
