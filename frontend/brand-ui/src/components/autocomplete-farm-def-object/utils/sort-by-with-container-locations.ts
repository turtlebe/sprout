import { isContainerLocation } from '@plentyag/core/src/farm-def/type-guards';

import { AllowedObjects } from '../hooks';

export function sortByWithContainerLocations(a: AllowedObjects, b: AllowedObjects) {
  if (isContainerLocation(a) && isContainerLocation(b)) {
    return a.index - b.index;
  }
  if (isContainerLocation(a)) {
    return -1;
  }
  if (isContainerLocation(b)) {
    return 1;
  }
  return a.path.localeCompare(b.path);
}
