import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';

/**
 * Filter down the maps state for just this machine
 */
export const filterMapsStateForMachine = (mapsState: MapsState, machine: FarmDefMachine): MapsState => {
  return Object.values((mapsState && machine?.containerLocations) || {}).reduce<MapsState>((agg, containerLocation) => {
    const { ref } = containerLocation;
    agg[ref] = mapsState[ref];
    return agg;
  }, {});
};
