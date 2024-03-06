import { GrowLaneProperties } from '@plentyag/app-production/src/maps-interactive-page/types';
import { ContainerLocation, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { sortBy } from 'lodash';

export interface GrowLaneData {
  laneName: string;
  startIndex: number;
  endIndex: number;
  towers: ContainerLocation[];
}

export interface UseVerticalGrowGraphDataReturn {
  lanes: GrowLaneData[];
  sortedContainerLocations: ContainerLocation[];
}

/**
 * Hook to help separate the data into lanes to help understand the shape of the grow room
 * This supports both straight, uturn and possible future "s" or any shape with a beginning and end
 *
 * How it works is that we will assume the different lanes represent a "turn" or a pivot
 *
 * @param {FarmDefMachine} machine
 * @returns {UseVerticalGrowGraphDataReturn}
 */
export const useVerticalGrowGraphData = (machine?: FarmDefMachine): UseVerticalGrowGraphDataReturn => {
  if (!machine) {
    return {
      lanes: [],
      sortedContainerLocations: [],
    };
  }

  const { containerLocations } = machine;

  // make sure is sorted by index
  const sortedContainerLocations = sortBy(containerLocations, 'index');

  // group cohorts by lane name
  const lanes = Object.values(sortedContainerLocations).reduce<GrowLaneData[]>((agg, location) => {
    const { index, properties } = location;
    const { lane: laneName = 'default' } = properties as GrowLaneProperties;

    // check aggregated array has existing lane
    // if so, add container location to this laneData
    const lastAggLane = agg[agg.length - 1];
    if (lastAggLane?.laneName === laneName) {
      lastAggLane.endIndex = index;
      lastAggLane.towers.push(location);
      return agg;
    }

    // add a new grow lane data with first conatiner location
    return [
      ...agg,
      {
        laneName: laneName,
        startIndex: index,
        endIndex: index,
        towers: [location],
      },
    ];
  }, []);

  return {
    lanes,
    sortedContainerLocations,
  };
};
