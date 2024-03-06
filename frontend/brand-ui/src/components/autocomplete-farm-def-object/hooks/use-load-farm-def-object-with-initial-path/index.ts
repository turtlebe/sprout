import { isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefSite } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../';
import {
  getFarmDefObjectByPathUrl,
  getSitePathFromPath,
  saveFarmDefObjectsInStore,
  saveSelectedFarmDefObjectInStore,
} from '../../utils';

/**
 * When the initialPath props is defined, fetch the root object of the initialPath (should be a site) with all its children.
 *
 * When the query resolves, traverse the object and collect all FarmDef Children and Device Location and sets it in the store.
 *
 * @param id
 * @param initialPath
 * @param showDeviceLocations
 */
export function useLoadFarmDefObjectWithInitialPath(id: string, initialPath: string) {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);
  const swrAxios = useSwrAxios<FarmDefSite>(
    {
      url:
        Boolean(initialPath) &&
        state.farmDefObjects
          .filter(isFarmDefSite)
          .map(site => site.path)
          .includes(getSitePathFromPath(initialPath)) &&
        getFarmDefObjectByPathUrl(getSitePathFromPath(initialPath), state.options),
    },
    { dedupingInterval: 30000 }
  );
  const { data: farmDefSite, error } = swrAxios;
  useLogAxiosErrorInSnackbar(error);

  React.useEffect(() => {
    if (farmDefSite) {
      saveFarmDefObjectsInStore(farmDefSite, actions, state.options.compatibleScheduleDefinition);
      saveSelectedFarmDefObjectInStore({ farmDefSite, state, actions, path: initialPath });
    }
  }, [farmDefSite, state.options.compatibleScheduleDefinition]);

  return swrAxios;
}
