import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mockMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';

import { filterMapsStateForMachine } from './filter-maps-state-for-machine';

const containerRef = '051e6061-5b07-45ff-badb-bd41c91a3d3e:containerLocation-Bay1';

const mockMachine = {
  containerLocations: {
    [containerRef]: {
      ...mockFarmDefContainerLocations,
      ref: containerRef,
    },
  },
} as unknown as FarmDefMachine;

describe('filterMapsStateForMachine', () => {
  it('handles undefined mapsState', () => {
    const result = filterMapsStateForMachine(undefined, mockMachine);

    expect(Object.keys(result).length).toEqual(0);
  });

  it('handles undefined containterLocations', () => {
    const mockNoContainerLocationsMachine = {} as unknown as FarmDefMachine;

    const result = filterMapsStateForMachine(mockMapsState, mockNoContainerLocationsMachine);

    expect(Object.keys(result).length).toEqual(0);
  });

  it('should filter down to map state matching to specific machine', () => {
    // ACT
    const result = filterMapsStateForMachine(mockMapsState, mockMachine);

    // ASSERT
    expect(Object.keys(result).length).toEqual(1);
    expect(result[containerRef].resourceState.containerId).toEqual('632a4625-9b60-4372-99a4-6e27b796c975');
  });
});
