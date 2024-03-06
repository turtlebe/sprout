import { isDeviceLocation, isFarmDefObject, isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';

import { AllowedObjects, AutocompleteFarmDefObjectState } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Returns whether a FarmDef Object has any Device Locations.
 *
 * It ignores the state if the FarmDef Object is a site, as we don't want to filter this top-level kind.
 *
 * @param option FarmDef Object or Device Location
 * @param state @see AutocompleteFarmDefObjectState'
 * @return Whether the FarmDef Object has Device Locations
 */
export function hasDeviceLocations(
  option: AllowedObjects,
  state: AutocompleteFarmDefObjectState,
  deviceTypes?: string[]
): boolean {
  // do not filter sites
  if (isFarmDefSite(option)) {
    return true;
  }

  if (isDeviceLocation(option)) {
    if (option.isGroup) {
      return false;
    }

    if (!deviceTypes) {
      return true;
    }

    return option.deviceTypes.filter(deviceType => deviceTypes.includes(deviceType)).length > 0;
  }

  return Boolean(isFarmDefObject(option) && state.deviceLocationCountMap.get(option.path) > 0);
}
