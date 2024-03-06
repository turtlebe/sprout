import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { getResourceLoadedDate } from '@plentyag/app-production/src/maps-interactive-page/utils/get-resource-loaded-date';

export const hasLoadDates = (mapsState: MapsState) => {
  return Object.values(mapsState).some(state => Boolean(getResourceLoadedDate(state)));
};
