import { MapsState } from '../../types';
import { doesResourceHaveMatchingLabel } from '../does-resource-have-matching-label';

export const filterMapsStateForLabels = (mapsState: MapsState, labels: string[] = []): MapsState => {
  if (!labels || labels.length === 0) {
    return mapsState;
  }

  return Object.keys(mapsState || {}).reduce<MapsState>((agg, key) => {
    const state = mapsState[key];

    if (doesResourceHaveMatchingLabel(state?.resourceState, labels)) {
      agg[key] = state;
    }

    return agg;
  }, {});
};
