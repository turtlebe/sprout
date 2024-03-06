import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { WORKSPACES_PATHS } from '../../../constants';
import { Workspace } from '../../types';

export interface UseGetWorkspacesReturn {
  workspaces: Workspace[];
  isLoading: boolean;
}

export const useGetWorkspaces = (): UseGetWorkspacesReturn => {
  const snackbar = useGlobalSnackbar();

  const { data, isValidating, error } = useSwrAxios<Workspace[]>({ url: `${WORKSPACES_PATHS.baseApiPath}` });

  React.useEffect(() => {
    if (error) {
      snackbar.errorSnackbar({ title: 'Error loading Workspaces list', message: parseErrorMessage(error) });
    }
  }, [error]);

  return { workspaces: data, isLoading: isValidating };
};
