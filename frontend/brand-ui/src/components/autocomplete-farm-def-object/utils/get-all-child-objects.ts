import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { getAllDirectKinds } from '.';

/**
 * Returns all of nested FarmDef Objects children for a given FarmDef Object.
 *
 * @param farmDefObject a FarmDef Object
 * @return a list of FarmDef Objects
 */
export function getAllChildObjects(farmDefObject: FarmDefObject) {
  const childObjects: FarmDefObject[] = [];

  function getAllChildObjectsRecursively(farmDefObject: FarmDefObject) {
    if (!farmDefObject || !isFarmDefObject(farmDefObject)) {
      return childObjects;
    }

    getAllDirectKinds(farmDefObject).forEach(attributeName => {
      Object.keys(farmDefObject[attributeName]).forEach(childFarmDefObjectKey => {
        const childFarmDefObject = farmDefObject[attributeName][childFarmDefObjectKey];
        if (isFarmDefObject(childFarmDefObject)) {
          childObjects.push(childFarmDefObject);
          getAllChildObjectsRecursively(childFarmDefObject);
        }
      });
    });
  }

  getAllChildObjectsRecursively(farmDefObject);

  return childObjects;
}
