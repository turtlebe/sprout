import { mockMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { filterMapsStateForCrops } from '.';

describe('filterMapsStateForCrops', () => {
  it('returns all maps state when crops filter is empty', () => {
    expect(filterMapsStateForCrops(mockMapsState, [])).toEqual(mockMapsState);
    expect(filterMapsStateForCrops(mockMapsState, undefined)).toEqual(mockMapsState);
    expect(filterMapsStateForCrops(mockMapsState, null)).toEqual(mockMapsState);
  });

  it('returns only maps state with matching crops: WHC', () => {
    const keys = Object.keys(mockMapsState);

    // only index 2 in mock data should have WHC
    const mapsStateWithWhc = {
      [keys[2]]: mockMapsState[keys[2]],
    };

    expect(filterMapsStateForCrops(mockMapsState, ['WHC'])).toEqual(mapsStateWithWhc);
  });

  it('returns only maps state with matching crops: BAC', () => {
    const keys = Object.keys(mockMapsState);

    // first three items in mock data should have BAC
    const mapsStateWithBac = {
      [keys[0]]: mockMapsState[keys[0]],
      [keys[1]]: mockMapsState[keys[1]],
      [keys[2]]: mockMapsState[keys[2]],
    };

    expect(filterMapsStateForCrops(mockMapsState, ['BAC'])).toEqual(mapsStateWithBac);
  });
});
