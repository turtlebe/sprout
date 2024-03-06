import { MapsState } from '../../../types';
import { EMPTY_CONTAINER } from '../types';

export function getCropCount(mapsState: MapsState) {
  const cropCount: {
    [crop: string]: number;
  } = {};

  // calculate count for each crop in resourceStateMap
  // also include count of empty containers
  mapsState &&
    Object.values(mapsState).forEach(mapState => {
      if (mapState?.resourceState) {
        const crop = mapState.resourceState.materialObj?.product || EMPTY_CONTAINER;
        cropCount[crop] = cropCount[crop] ? cropCount[crop] + 1 : 1;
      }
    });
  return cropCount;
}
