import { EMPTY_CONTAINER_COLOR } from '@plentyag/app-production/src/maps-interactive-page/types';

import { mocksResourcesState } from '../../test-helpers/mock-maps-state';

import { getColorsForCropsInResource } from '.';

const mockMapping = {
  BAC: 'red',
  WHC: 'blue',
};

function mockGetCropColor(cropName: string) {
  return mockMapping[cropName];
}

describe('getColorsForCropsInResource', () => {
  it('returns single color', () => {
    const resourceWithCropBac = mocksResourcesState[0];

    expect(getColorsForCropsInResource(resourceWithCropBac, mockGetCropColor)).toEqual({ firstCropColor: 'red' });
  });

  it('returns two colors', () => {
    const resourceWithCropsBacWhc = mocksResourcesState[2];

    expect(getColorsForCropsInResource(resourceWithCropsBacWhc, mockGetCropColor)).toEqual({
      firstCropColor: 'red',
      secondCropColor: 'blue',
    });
  });

  it('returns empty container color when container has no material', () => {
    const resourceWithNoMaterial = mocksResourcesState[3];

    expect(getColorsForCropsInResource(resourceWithNoMaterial, mockGetCropColor)).toEqual({
      firstCropColor: EMPTY_CONTAINER_COLOR,
      secondCropColor: undefined,
    });
  });

  it('returns undefined for both colors when there is no container and material', () => {
    expect(getColorsForCropsInResource(undefined, mockGetCropColor)).toEqual({
      firstCropColor: undefined,
      secondCropColor: undefined,
    });
  });
});
