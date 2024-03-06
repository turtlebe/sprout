import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { getParentFarmDefPath } from '.';

export function getFarmCode(farmDefObject: AllowedObjects, farmDefObjects: AllowedObjects[]) {
  let farmCode: string;

  if (isFarmDefObject(farmDefObject)) {
    let curr = farmDefObject;
    // traverse up the tree to find the farmCode.
    while (curr && !curr.properties.farmCode && getParentFarmDefPath(curr.path)) {
      const parentPath = getParentFarmDefPath(curr.path);
      curr = farmDefObjects.find(obj => obj.path === parentPath) as FarmDefObject;
    }

    farmCode = curr.properties.farmCode;
  }

  return farmCode;
}
