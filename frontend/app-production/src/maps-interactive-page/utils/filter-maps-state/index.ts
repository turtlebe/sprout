import { MapsState, QueryParameters } from '@plentyag/app-production/src/maps-interactive-page/types';

import { filterMapsStateForAgeCohort } from '../filter-maps-state-for-age-cohort';
import { filterMapsStateForCrops } from '../filter-maps-state-for-crops';
import { filterMapsStateForLabels } from '../filter-maps-state-for-labels';

export interface FilterMapsStateArgs {
  mapsState: MapsState;
  queryParameters: QueryParameters;
}

/**
 * This helper function filters the given map state using the
 * values from: ageCohortDate, selectedCrops, and selectedLabels,
 * returning only maps state that match all three filters.
 */
export const filterMapsState = ({ mapsState, queryParameters }: FilterMapsStateArgs) => {
  const filteredByAgeCohort = filterMapsStateForAgeCohort(mapsState, queryParameters.ageCohortDate);
  const filteredByAgeCohortAndCrops = filterMapsStateForCrops(filteredByAgeCohort, queryParameters.selectedCrops);
  return filterMapsStateForLabels(filteredByAgeCohortAndCrops, queryParameters.selectedLabels);
};
