import v from 'voca';

import { getLastPathSegmentFromStringPath } from './get-last-path-segment-from-string-path';

/**
 * Returns a official tower destination value (can be used in actions)
 *
 * Example:
 *   from: sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/CutagainBuffer
 *   to:   cutagain-buffer
 *
 * @param {string} path farm def path
 * @returns {string} to official tower destination value i.e. cutagain-buffer
 */
export const getTowerDestinationFromPath = (path: string) => {
  if (!path) {
    return '';
  }

  const pathName = getLastPathSegmentFromStringPath(path);

  // if grow names just remove "-"
  const growRoomReg = /^GR\d/g;
  if (pathName.match(growRoomReg)) {
    return `${pathName.match(growRoomReg).pop()}-${pathName.split(growRoomReg).pop()}`;
  }

  // otherwise, convert to lowercase
  return v(pathName).chain().words().value().join('-').toLowerCase();
};
