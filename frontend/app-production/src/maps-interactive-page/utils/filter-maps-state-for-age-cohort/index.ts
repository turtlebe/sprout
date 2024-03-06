import { AgeCohortDate, MapsState } from '../../types';
import { getResourceLoadedDate } from '../get-resource-loaded-date';
import { isLoadDateInSameDayAsAgeCohortDate } from '../is-load-date-in-same-day-as-age-cohort-date';

export const filterMapsStateForAgeCohort = (mapsState: MapsState, selectedAgeCohortDate: AgeCohortDate): MapsState => {
  if (selectedAgeCohortDate === 'all') {
    return mapsState;
  }

  return Object.keys(mapsState || {}).reduce<MapsState>((agg, key) => {
    const state = mapsState[key];

    const loadedDate = getResourceLoadedDate(state);

    if (isLoadDateInSameDayAsAgeCohortDate(selectedAgeCohortDate, loadedDate)) {
      agg[key] = state;
    }

    return agg;
  }, {});
};
