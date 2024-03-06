import { useCoreStore } from '@plentyag/core/src/core-store';
import { FarmDefFarm, FarmDefWorkcenter } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

export interface UseLoadWorkcentersReturn {
  workcenters: FarmDefWorkcenter[];
  isLoading: boolean;
}

export const URL = '/api/plentyservice/farm-def-service/get-object-by-path-v2';

export const useLoadWorkcenters = (): UseLoadWorkcentersReturn => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;

  const { data, isValidating, error } = useSwrAxios<FarmDefFarm>({
    url: `${URL}/${currentFarmDefPath}`,
  });

  useLogAxiosErrorInSnackbar(error, 'Error loading Workcenters');

  const workcenters = React.useMemo(() => {
    return data?.workCenters ? Object.values(data.workCenters) : [];
  }, [data]);

  return { workcenters, isLoading: isValidating };
};
