import { isDeviceLocation } from '@plentyag/core/src/farm-def/type-guards';
import { Kinds } from '@plentyag/core/src/farm-def/types';
import { isValidKind } from '@plentyag/core/src/farm-def/utils';

import { AllowedObjects } from '../hooks/use-autocomplete-farm-def-object-store';

/**
 * Return all the direct attributes that are FarmDef Kind for a given FarmDef Object.
 *
 * @param farmDefObject FarmDef Object
 * @return List of FarmDedf Kinds (plural form)
 */
export function getAllDirectKinds(farmDefObject: AllowedObjects): Kinds[] {
  const kinds: Kinds[] = [];

  if (isDeviceLocation(farmDefObject)) {
    return kinds;
  }

  Object.keys(farmDefObject).forEach(attributeName => {
    if (isValidKind(attributeName)) {
      kinds.push(attributeName as Kinds);
    }
  });

  return kinds;
}
