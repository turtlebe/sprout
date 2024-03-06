import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { ChildDeviceLocation, DeviceLocation, FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { getAllDirectKinds } from '.';

export interface GetAvailableDeviceLocations {
  deviceLocations: DeviceLocation[];
  childDeviceLocations: ChildDeviceLocation[];
}

/**
 * Returns available device locations for a given FarmDef Object.
 *
 * A device location is considered available if no device has been placed in it.
 *
 * It returns all the device locations at the current level and nested
 * under children FarmDef Objects.
 *
 * @param farmDefObject a FarmDef Object
 * @return a list of Device Locations
 */
export function getAvailableDeviceLocations(farmDefObject: FarmDefObject): GetAvailableDeviceLocations {
  const deviceLocations: DeviceLocation[] = [];
  const childDeviceLocations: ChildDeviceLocation[] = [];

  function getAvailableDeviceLocationsRecursiveley(farmDefObject: FarmDefObject) {
    if (!farmDefObject || !isFarmDefObject(farmDefObject)) {
      return;
    }

    if (farmDefObject.deviceLocations) {
      Object.keys(farmDefObject.deviceLocations).forEach(deviceLocationKey => {
        const deviceLocation = farmDefObject.deviceLocations[deviceLocationKey];
        if (deviceLocation.isGroup) {
          if (!deviceLocation.locations) {
            console.error('No FarmDef deviceLocation.locations');
            return;
          }
          Object.keys(deviceLocation.locations).forEach(locationKey => {
            const childDeviceLocation = deviceLocation.locations[locationKey];
            if (!childDeviceLocation.placedDeviceId) {
              childDeviceLocations.push({
                ...childDeviceLocation,
                properties: { ...childDeviceLocation.properties, deviceTypes: deviceLocation.deviceTypes },
              });
            }
          });
        } else if (!deviceLocation.placedDeviceId) {
          deviceLocations.push(deviceLocation);
        }
      });
    }

    getAllDirectKinds(farmDefObject).forEach(attributeName => {
      Object.keys(farmDefObject[attributeName]).forEach(childFarmDefObjectKey => {
        const childFarmDefObject = farmDefObject[attributeName][childFarmDefObjectKey];
        if (isFarmDefObject(childFarmDefObject)) {
          getAvailableDeviceLocationsRecursiveley(childFarmDefObject);
        }
      });
    });
  }
  getAvailableDeviceLocationsRecursiveley(farmDefObject);

  return { deviceLocations, childDeviceLocations };
}
