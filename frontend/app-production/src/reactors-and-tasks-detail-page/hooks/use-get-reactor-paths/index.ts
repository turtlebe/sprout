import { getSitePathFromPath } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { ReactorPath } from '../../types';

export interface UseGetReactorPathsReturn {
  reactorPaths: ReactorPath[];
  isLoading: boolean;
}

type ReactorName = string;

interface ResponseData {
  [reactorPath: string]: ReactorName;
}

export const useGetReactorPaths = (): UseGetReactorPathsReturn => {
  const snackbar = useGlobalSnackbar();

  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;
  const sitePath = currentFarmDefPath && getSitePathFromPath(currentFarmDefPath);
  const url = sitePath && '/api/plentyservice/executive-service/get-reactor-paths';

  const { data, error, isValidating } = useSwrAxios<ResponseData[]>({
    url,
    params: {
      sitePath,
    },
  });

  const reactorPaths = data && Object.keys(data);

  React.useEffect(() => {
    if (error) {
      snackbar.errorSnackbar({ title: 'Error loading reactor paths', message: parseErrorMessage(error) });
    }
  }, [error]);

  return { reactorPaths, isLoading: isValidating };
};
