import { MapsState } from '../../types';
import { doesResourceHaveMatchingCrop } from '../does-resource-have-matching-crop';

export const filterMapsStateForCrops = (mapsState: MapsState, crops: string[] = []): MapsState => {
  if (!crops || crops.length === 0) {
    return mapsState;
  }

  return Object.keys(mapsState || {}).reduce<MapsState>((agg, key) => {
    const state = mapsState[key];

    if (doesResourceHaveMatchingCrop(state?.resourceState, crops)) {
      agg[key] = state;
    }

    return agg;
  }, {});
};
