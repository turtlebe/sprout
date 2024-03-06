import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { CurrentUser } from '@plentyag/core/src/core-store/types';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseUpdateCurrentFarmDefPathReturn {
  makeUpdate: (updatedCurrentFarmDefPath: string) => void;
  isUpdating: boolean;
}

interface UpdateUserData {
  currentFarmDefPath: string;
}

export const useUpdateCurrentFarmDefPath = (): UseUpdateCurrentFarmDefPathReturn => {
  const snackbar = useGlobalSnackbar();
  const [{ currentUser }, actions] = useCoreStore();
  const currentFarmDefPath = currentUser?.currentFarmDefPath;

  const { makeRequest, isLoading } = usePutRequest<CurrentUser, UpdateUserData>({
    url: '/api/core/current-user',
  });

  const makeUpdate = React.useCallback(
    (updatedCurrentFarmDefPath: string) => {
      if (updatedCurrentFarmDefPath && currentFarmDefPath !== updatedCurrentFarmDefPath) {
        makeRequest({
          data: {
            currentFarmDefPath: updatedCurrentFarmDefPath,
          },
          onSuccess: () => actions.setCurrentFarmDefPath(updatedCurrentFarmDefPath),
          onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
        });
      }
    },
    [currentFarmDefPath]
  );

  return { makeUpdate, isUpdating: isLoading };
};
