import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { get } from 'lodash';

import { getParentFarmDefPath, isFarmDefSitePath } from '.';

/**
 * Return a nested FarmDef Object for a given FarmDef Object and a FarmDef path.
 *
 * If the path has invalid segments, it tries to go back into the ancestor path
 * until it finds a valid object, otherwise it returns null.
 *
 * @param site FarmDef Site
 * @param path FarmDef Path
 * @return FarmDef Object
 */
export function getFarmDefObjectByPathRelativeToSite(site: FarmDefObject, path: string): FarmDefObject {
  if (!path) {
    return null;
  }

  if (isFarmDefSitePath(path)) {
    return site;
  }

  const pathRelativeToSite = path.replace(/\//g, '.').split('.').slice(2).join('.');
  const farmDefObject = get(site, pathRelativeToSite);

  if (!farmDefObject) {
    return getFarmDefObjectByPathRelativeToSite(site, getParentFarmDefPath(path));
  }

  return farmDefObject;
}
