import { isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefSite } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../';
import { getFarmDefObjectByIdUrl, isFarmDefSiteDescendantsAbsent, saveFarmDefObjectsInStore } from '../../utils';

/**
 * When an Option from the Autocomplete is selected and is a FarmDef Site, fetch the object with all its children.
 *
 * When the query resolves, traverse the object and collect all FarmDef Children and Device Location and sets it in the store.
 *
 * @param id The ID of the autocomplete
 * @param showDeviceLocations
 */
export function useLoadFarmDefObjectWithSelectedOption(id: string) {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);
  const swrAxios = useSwrAxios<FarmDefSite>(
    {
      url:
        isFarmDefSite(state.selectedFarmDefObject) &&
        isFarmDefSiteDescendantsAbsent(state.selectedFarmDefObject, state) &&
        getFarmDefObjectByIdUrl(state.selectedFarmDefObject, state.options),
    },
    { dedupingInterval: 30000 }
  );
  const { data: farmDefSite, error } = swrAxios;
  useLogAxiosErrorInSnackbar(error);

  React.useEffect(() => {
    if (farmDefSite) {
      saveFarmDefObjectsInStore(farmDefSite, actions, state.options.compatibleScheduleDefinition);
    }
  }, [farmDefSite, state.options.compatibleScheduleDefinition]);

  return swrAxios;
}
