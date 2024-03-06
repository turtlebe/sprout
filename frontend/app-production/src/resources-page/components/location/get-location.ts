import { ContainerLocation, FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { separatorChar } from '@plentyag/core/src/farm-def/utils';

export function getLocation(farmDefMachine: FarmDefObject, location: ProdResources.Location) {
  if (!location?.machine) {
    return '';
  }

  const locationParts = [location.machine.siteName, location.machine.areaName, location.machine.lineName];

  if (farmDefMachine) {
    if (farmDefMachine.name !== undefined) {
      locationParts.push(farmDefMachine.name);
    }

    const farmdefContainerLocationRef = location.containerLocation?.farmdefContainerLocationRef;

    if (farmDefMachine.containerLocations && farmdefContainerLocationRef !== undefined) {
      const containerLocation: ContainerLocation = Object.values(farmDefMachine.containerLocations).find(
        containerLocation => containerLocation.ref == farmdefContainerLocationRef
      );

      if (containerLocation && containerLocation.name) {
        locationParts.push(containerLocation.name);
      }
    }
  }

  return locationParts.join(separatorChar);
}
