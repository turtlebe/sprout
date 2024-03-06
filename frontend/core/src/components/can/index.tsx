import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Snackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { useCoreStore } from '@plentyag/core/src/core-store';
import React from 'react';

interface CanProps {
  resource: Resources;
  level: PermissionLevels;
  fallback?: JSX.Element;
  onPermissionDenied?: () => void;
  disableSnackbar?: boolean;
  snackbarProps?: Pick<Snackbar, 'severity' | 'message'>;
}

export const DEFAULT_FALLBACK_ERROR_MESSAGE = 'Sorry, you do not have permission to view this page.';

export const Can: React.FC<CanProps> = ({
  children,
  resource,
  level,
  fallback: propsFallback,
  onPermissionDenied,
  disableSnackbar,
  snackbarProps,
}) => {
  const [coreState] = useCoreStore();
  const snackbar = useGlobalSnackbar();
  const { currentUser } = coreState;

  const fallback = propsFallback;

  const shouldRenderFallback = resource && level && !currentUser.hasPermission(resource, level);

  React.useEffect(() => {
    if (shouldRenderFallback) {
      if (!disableSnackbar) {
        snackbar.updateSnackbar({
          message: DEFAULT_FALLBACK_ERROR_MESSAGE,
          severity: 'error',
          open: true,
          ...snackbarProps,
        });
      }
      onPermissionDenied && onPermissionDenied();
    }
  }, [shouldRenderFallback, disableSnackbar, onPermissionDenied]);

  if (shouldRenderFallback) {
    return fallback ?? <></>;
  }

  return <>{children}</>;
};
