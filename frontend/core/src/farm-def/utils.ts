import { DeviceLocation, Kind, Kinds, validKind, validKinds } from './types';
export const separatorChar = '/';

/**
 * Returns boolean true if given kind is in the valid list of kinds.
 * Returns false if does not exists.
 * @param kindPural Plural version of a kind (e.g., sites, lines, areas, etc.)
 */
export function isValidKind(kind: string, form: 'singular' | 'plural' = 'plural') {
  if (form === 'plural') {
    return validKinds.includes(kind as Kinds);
  }

  return validKind.includes(kind as Kind);
}

/**
 * For given farm def path, returns the kind value.
 * For example in path: sites/SSF2/areas/PrimaryPostHarvest/lines/ProductPacking
 * calling with kind "areas" would return "PrimaryPostHarvest"
 */
export function getKindFromPath(fullFarmDefPath: string, kind: Kinds): string {
  if (!fullFarmDefPath || !kind) {
    return null;
  }
  const pathParts = fullFarmDefPath.split(separatorChar);
  const kindIndex = pathParts.indexOf(kind);
  return kindIndex !== -1 && kindIndex + 1 <= pathParts.length ? pathParts[kindIndex + 1] : null;
}

export function isChildDeviceLocationRef(ref: string) {
  // example: 32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup:Sprinkle123
  return new RegExp(/^(.*?)(:deviceLocation-)([0-9a-zA-Z]+):([0-9a-zA-Z]+)$/).test(ref);
}

export function getDeviceLocationRefFromChildDeviceLocationRef(childDeviceLocation: string) {
  if (isChildDeviceLocationRef(childDeviceLocation)) {
    return childDeviceLocation.split(':').slice(0, -1).join(':');
  }

  return null;
}

export function getDeviceLocationPath(deviceLocation: DeviceLocation) {
  if (!deviceLocation) {
    return undefined;
  }

  if (deviceLocation.isGroup && Object.keys(deviceLocation.locations).length === 1) {
    const [childDeviceLocationName] = Object.keys(deviceLocation.locations);
    return deviceLocation.locations[childDeviceLocationName].path;
  }

  return deviceLocation.path;
}
