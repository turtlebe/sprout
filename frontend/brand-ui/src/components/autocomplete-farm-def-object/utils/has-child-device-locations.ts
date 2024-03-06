import { isChildDeviceLocation, isFarmDefObject, isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';

import { AllowedObjects, AutocompleteFarmDefObjectState } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Returns whether a FarmDef Object has any Child Device Locations.
 *
 * It ignores the state if the FarmDef Object is a site, as we don't want to filter this top-level kind.
 *
 * @param option FarmDef Object or Device Location
 * @param state @see AutocompleteFarmDefObjectState'
 * @return Whether the FarmDef Object has Device Locations
 */
export function hasChildDeviceLocations(
  option: AllowedObjects,
  state: AutocompleteFarmDefObjectState,
  deviceTypes?: string[]
): boolean {
  // do not filter sites
  if (isFarmDefSite(option)) {
    return true;
  }

  if (isChildDeviceLocation(option)) {
    if (!deviceTypes) {
      return true;
    }
    return option.properties?.deviceTypes?.filter(deviceType => deviceTypes.includes(deviceType)).length > 0;
  }

  return Boolean(isFarmDefObject(option) && state.deviceLocationCountMap.get(option.path) > 0);
}
