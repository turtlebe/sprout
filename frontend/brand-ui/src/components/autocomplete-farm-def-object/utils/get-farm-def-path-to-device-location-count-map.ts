import { ChildDeviceLocation, DeviceLocation, FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { getFarmDefPathToObjectCountMap } from '.';

const sum = (a, b) => a + b;

/**
 * The location can be a DeviceLocation or a ChildDeviceLocation if passed.
 *
 * If the location does not have a device placed with it and the deviceTypes matches (if passed), then count as 1, otherwise 0.
 */
const count = (deviceLocation: DeviceLocation, deviceTypes?: string[], childDeviceLocation?: ChildDeviceLocation) => {
  const childDeviceLocationOrDeviceLocation = childDeviceLocation ?? deviceLocation;
  if (
    !childDeviceLocationOrDeviceLocation.placedDeviceId &&
    (!deviceTypes || deviceTypes.some(deviceType => deviceLocation.deviceTypes.includes(deviceType)))
  ) {
    return 1;
  }

  return 0;
};

/**
 * Create a Map where the keys are FarmDef Paths and the values are a count of all the Device Locations.
 *
 * The Device Locations adds up to each level. For example:
 *
 * If sites/SSF2/areas/BMP has 3 direct Device Locations and sites/SSF2 has 1 direct Device Locations, the
 * map returned will have these two pairs:
 *   - sites/SSF2 -> 4
 *   - sites/SSF2/areas/BMP -> 3
 *
 * @param farmDefObject FarmDefObject
 * @return Map of FarmDefPath to Device Location count
 */
export function getFarmDefPathToDeviceLocationCountMap(farmDefObject: FarmDefObject, deviceTypes?: string[]) {
  function countDeviceLocation(farmDefObject: FarmDefObject) {
    if (!farmDefObject.deviceLocations) {
      return 0;
    }

    return Object.keys(farmDefObject.deviceLocations)
      .map(key => {
        const deviceLocation = farmDefObject.deviceLocations[key];

        // Device Location is not a Group, we can take it into account.
        if (!deviceLocation.isGroup) {
          return count(deviceLocation, deviceTypes);
        }

        // Device Location is a Group, we don't care about the DeviceLocation but rather the ChildDeviceLocations
        // nested under.
        return Object.keys(deviceLocation.locations || {})
          .map(key => {
            const childDeviceLocation = deviceLocation.locations[key];
            return count(deviceLocation, deviceTypes, childDeviceLocation);
          })
          .reduce(sum, 0);
      })
      .reduce(sum, 0);
  }

  return getFarmDefPathToObjectCountMap(farmDefObject, countDeviceLocation);
}
