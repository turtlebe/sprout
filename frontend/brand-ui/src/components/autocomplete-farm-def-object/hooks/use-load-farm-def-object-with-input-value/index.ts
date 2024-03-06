import { isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefSite } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../';
import {
  getFarmDefObjectByPathUrl,
  getFarmDefPath,
  getSitePathFromPath,
  saveFarmDefObjectsInStore,
  saveSelectedFarmDefObjectInStore,
} from '../../utils';

/**
 * When the Input value of the the Autocomplete is defined and no Option has been selected, fetch
 * the root FarmDef Object (which should be a site) of the inputValue path with all its children.
 *
 * This is the use-case of someone pasting a path into the TextField prior to selecting a site.
 *
 * When the query resolves, traverse the object and collect all FarmDef Children and Device Location and sets it in the store.
 *
 * @param id
 * @param showDeviceLocations
 */
export function useLoadFarmDefObjectWithInputValue(id: string) {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);
  const swrAxios = useSwrAxios<FarmDefSite>(
    {
      url:
        Boolean(state.inputValue) &&
        !state.selectedFarmDefObject &&
        state.farmDefObjects
          .filter(isFarmDefSite)
          .map(site => site.path)
          .includes(getSitePathFromPath(getFarmDefPath(state.inputValue))) &&
        getFarmDefObjectByPathUrl(getSitePathFromPath(getFarmDefPath(state.inputValue)), state.options),
    },
    { dedupingInterval: 30000 }
  );
  const { data: farmDefSite, error } = swrAxios;
  useLogAxiosErrorInSnackbar(error);

  React.useEffect(() => {
    if (farmDefSite) {
      saveFarmDefObjectsInStore(farmDefSite, actions, state.options.compatibleScheduleDefinition);
      saveSelectedFarmDefObjectInStore({ farmDefSite, state, actions, path: getFarmDefPath(state.inputValue) });
    }
  }, [farmDefSite, state.options.compatibleScheduleDefinition]);

  return swrAxios;
}
