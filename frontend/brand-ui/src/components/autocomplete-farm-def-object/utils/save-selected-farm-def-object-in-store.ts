import { isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefSite } from '@plentyag/core/src/farm-def/types';

import { AutocompleteFarmDefObjectActions, AutocompleteFarmDefObjectState } from '../hooks';

import { getFarmDefObjectByPathRelativeToSite, getShortenedPathFromObject, getSitePathFromPath, isPathEquals } from '.';

interface SaveSelectedFarmDefObjectInStore {
  actions: AutocompleteFarmDefObjectActions;
  farmDefSite: FarmDefSite;
  path: string;
  state: AutocompleteFarmDefObjectState;
}

export function saveSelectedFarmDefObjectInStore({
  actions,
  farmDefSite,
  path,
  state,
}: SaveSelectedFarmDefObjectInStore) {
  let farmDefObject = getFarmDefObjectByPathRelativeToSite(farmDefSite, path);

  // When getting a site from `getFarmDefObjectByPathRelativeToSite`, it corresponds to `farmDefSite` which is a site with all its descendant.
  // That object is not available as part of the options since we already loaded all sites without descendants into the store. @see useLoadFarmDefSites.
  // To prevent material-ui autocomplete to throw a warning, we swap the FarmDef site with all its descendant with the one from the store.
  if (isFarmDefSite(farmDefObject)) {
    farmDefObject = state.farmDefObjects.filter(isFarmDefSite).find(isPathEquals(getSitePathFromPath(path)));
  }

  if (farmDefObject) {
    actions.setSelectedFarmDefObject(farmDefObject);
    actions.setInputvalue(getShortenedPathFromObject(farmDefObject));
  }
}
