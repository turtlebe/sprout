import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

export const PERMISSION_ERROR = 'User does not have permission to submit operation.';

export const useHasProductionPermissions = (requiredPermissionLevel: PermissionLevels): boolean => {
  const state = useCoreStore()[0];

  const hasPermission = state.currentUser.hasPermission(Resources.HYP_PRODUCTION, requiredPermissionLevel);

  const snackbar = useGlobalSnackbar();

  React.useEffect(() => {
    if (!hasPermission) {
      snackbar.errorSnackbar({ message: PERMISSION_ERROR });
    }
  }, [hasPermission]);

  return hasPermission;
};
