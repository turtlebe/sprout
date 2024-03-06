import { AllowedObjects, AutocompleteFarmDefObjectState } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Returns whether an option is found in the fetched ObservationGroups.
 */
export function hasObservations(option: AllowedObjects, state: AutocompleteFarmDefObjectState) {
  return Boolean(state.treeObservationGroups.children[option.path]);
}
