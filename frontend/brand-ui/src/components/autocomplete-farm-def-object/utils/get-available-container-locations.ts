import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { ContainerLocation, FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { getAllDirectKinds } from '.';

/**
 * Returns available container locations for a given FarmDef Object.
 *
 * It returns all the container locations at the current level and nested
 * under children FarmDef Objects.
 *
 * @param farmDefObject a FarmDef Object
 * @return a list of Container Locations
 */
export function getAvailableContainerLocations(farmDefObject: FarmDefObject) {
  const containerLocations: ContainerLocation[] = [];

  function getAvailableContainerLocationsRecursiveley(farmDefObject: FarmDefObject) {
    if (!farmDefObject || !isFarmDefObject(farmDefObject)) {
      return;
    }

    if (farmDefObject.containerLocations) {
      Object.keys(farmDefObject.containerLocations).forEach(containerLocationKey => {
        const containerLocation = farmDefObject.containerLocations[containerLocationKey];
        containerLocations.push(containerLocation);
      });
    }

    getAllDirectKinds(farmDefObject).forEach(attributeName => {
      Object.keys(farmDefObject[attributeName]).forEach(childFarmDefObjectKey => {
        const childFarmDefObject = farmDefObject[attributeName][childFarmDefObjectKey];
        if (isFarmDefObject(childFarmDefObject)) {
          getAvailableContainerLocationsRecursiveley(childFarmDefObject);
        }
      });
    });
  }
  getAvailableContainerLocationsRecursiveley(farmDefObject);

  return containerLocations;
}
