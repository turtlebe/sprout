import { isDeviceLocation } from '@plentyag/core/src/farm-def/type-guards';
import { getDeviceLocationPath } from '@plentyag/core/src/farm-def/utils';
import { getShortenedPath } from '@plentyag/core/src/utils';

import { AllowedObjects } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Return a shortened version of a FarmDef Path for a given FarmDef Object or Device Location.
 *
 * This shortened version is ued for the Autocomplete input value.
 *
 * @param object FarmDef Object or Device Location
 * @return Shortened version of the FarmDef Path
 */
export function getShortenedPathFromObject(object: AllowedObjects): string {
  if (!object || !object.path) {
    return undefined;
  }

  if (isDeviceLocation(object)) {
    return getShortenedPath(getDeviceLocationPath(object), true);
  }

  return getShortenedPath(object.path, true);
}
