import { FarmDefSite } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../';

const SEARCH_FARM_DEF_SITES = '/api/plentyservice/farm-def-service/search-object?kind=site';

export function useLoadFarmDefSites(id: string) {
  const [, actions] = useAutocompleteFarmDefObjectStore(id);
  const swrAxios = useSwrAxios<FarmDefSite[]>({ url: SEARCH_FARM_DEF_SITES });
  const { data: farmDefObjects, error } = swrAxios;
  useLogAxiosErrorInSnackbar(error);

  React.useEffect(() => {
    if (farmDefObjects) {
      actions.addFarmDefObjects(farmDefObjects);
    }
  }, [farmDefObjects]);

  return swrAxios;
}
