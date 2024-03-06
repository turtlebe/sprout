import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useGetRequest } from '@plentyag/core/src/hooks/use-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

import { MAPS_PATHS } from '../../constants';
import { MapTable } from '../types';
import { getKindValue } from '../utils';

const MAP_TABLE_URL = `${MAPS_PATHS.baseApiPath}/table`;

interface UseLoadMapTableReturn {
  loadData: (farmDefPath) => void;
  clearData: () => void;
  mapTable: MapTable;
  isLoading: boolean;
}

export function useLoadMapTable(initialFarmDefPath?: string): UseLoadMapTableReturn {
  const snackbar = useGlobalSnackbar();
  const { makeRequest, isLoading } = useGetRequest<MapTable>({ url: MAP_TABLE_URL });
  const [mapTable, setMapTable] = React.useState<MapTable>([]);

  function clearData() {
    setMapTable([]);
  }

  function loadData(farmDefPath: string) {
    const site = getKindValue(farmDefPath, 'sites');
    const area = getKindValue(farmDefPath, 'areas');
    const line = getKindValue(farmDefPath, 'lines');
    if (site && area) {
      makeRequest({
        queryParams: { site, area, line },
        onSuccess: (responseData: MapTable) =>
          setMapTable(responseData.map(data => ({ ...data, ref: data.ref || uuidv4() }))),
        onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
      });
    } else {
      clearData();
    }
  }

  const hasCalled = React.useRef<boolean>(false);

  React.useEffect(() => {
    // call only once when we get a truthy initialFarmDefPath.
    if (!hasCalled.current && initialFarmDefPath) {
      hasCalled.current = true;
      loadData(initialFarmDefPath);
    }
  }, [initialFarmDefPath]);

  return {
    loadData,
    clearData,
    mapTable,
    isLoading,
  };
}
