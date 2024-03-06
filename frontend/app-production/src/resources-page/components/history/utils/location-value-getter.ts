import { ValueGetterParams } from '@ag-grid-community/all-modules';
import { getShortenedPath } from '@plentyag/core/src/utils';

import { getShortenedFarmDefPath, getStateOut } from '.';

export function locationValueGetter(params: ValueGetterParams) {
  const stateOut = getStateOut(params);

  // get container location index (if available)
  const index = stateOut?.location?.containerLocation?.index
    ? ` index: ${stateOut.location.containerLocation.index}`
    : '';

  // some resources have a farmDefPath, if so it is easy to get container location path.
  if (stateOut?.location?.containerLocation?.farmDefPath) {
    return `${getShortenedPath(stateOut.location.containerLocation.farmDefPath)}${index}`;
  }

  // otherwise construct path from data given in machine object.
  if (stateOut?.location?.machine) {
    return `${getShortenedFarmDefPath(stateOut.location.machine)}${index}`;
  }
}
