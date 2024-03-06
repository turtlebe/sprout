import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';

import { ACTIONS_PATHS } from '../../../constants';

export const emptyAction: ProdActions.ActionModel = {
  name: 'Loading...',
  description: 'Loading...',
  fields: [],
  actionType: null,
};

export const useGetActionModel = (operation: ProdActions.Operation) => {
  const snackbar = useGlobalSnackbar();

  function onError(err: any) {
    snackbar.errorSnackbar({ message: `Error getting actions ${parseErrorMessage(err)}` });
  }

  const path = operation?.path;
  const url = `${ACTIONS_PATHS.baseApiPath}/${path}`;

  const result = useSwrAxios<ProdActions.ActionModel>(path ? { url } : undefined, { onError });

  const isLoadingAction = result.isValidating || !result.data;

  return {
    isLoadingAction,
    action: result.data || emptyAction,
    actionError: result.error,
  };
};
