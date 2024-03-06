import { cloneDeep } from 'lodash';

import { mockCrops } from '../../test-helpers';
import { GrowConfigurationType } from '../../types';

import { getGrowConfiguration } from '.';

describe('getGrowConfiguration', () => {
  it('gets grow config: "blended at seeding machine"', () => {
    const mockCrop = mockCrops[1];
    expect(getGrowConfiguration(mockCrop)).toEqual(GrowConfigurationType.isBlendedAtSeedingMachine);
  });

  it('gets grow config: "seeded alone"', () => {
    const mockCrop = mockCrops[0];
    expect(getGrowConfiguration(mockCrop)).toEqual(GrowConfigurationType.isSeedableAlone);
  });

  it('gets grow config: "blended at blending machine"', () => {
    const mockCrop = cloneDeep(mockCrops[1]);
    mockCrop.isSeedable = false;
    expect(getGrowConfiguration(mockCrop)).toEqual(GrowConfigurationType.isBlendedAtBlendingMachine);
  });

  it('gets grow config: "neither seeded or blended"', () => {
    const mockCrop = cloneDeep(mockCrops[0]);
    mockCrop.isSeedable = false;
    expect(getGrowConfiguration(mockCrop)).toEqual(GrowConfigurationType.isNotSeededOrBlended);
  });
});
