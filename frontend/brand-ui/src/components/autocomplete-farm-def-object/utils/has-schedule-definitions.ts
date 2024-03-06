import { isFarmDefObject, isFarmDefSite, isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';

import { AllowedObjects, AutocompleteFarmDefObjectState } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Returns whether a FarmDef Object has any Schedule Definitions.
 *
 * It ignores the state if the FarmDef Object is a site, as we don't want to filter this top-level kind.
 *
 * @param option FarmDef Object or Schedule Definitions
 * @param state @see AutocompleteFarmDefObjectState'
 * @return Whether the FarmDef Object has Schedule Definitions
 */
export function hasScheduleDefinitions(option: AllowedObjects, state: AutocompleteFarmDefObjectState): boolean {
  // do not filter sites
  if (isFarmDefSite(option)) {
    return true;
  }

  if (isScheduleDefinition(option)) {
    return true;
  }

  return Boolean(isFarmDefObject(option) && state.scheduleDefinitionCountMap.get(option.path) > 0);
}
