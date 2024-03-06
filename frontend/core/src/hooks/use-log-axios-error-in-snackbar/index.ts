import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

export function useLogAxiosErrorInSnackbar(error: any, title?: string, suppressConsoleLog?: boolean) {
  const snackbar = useGlobalSnackbar();

  React.useEffect(() => {
    if (error) {
      const errorMessage = parseErrorMessage(error);
      snackbar.errorSnackbar({ message: errorMessage, title });
      if (!suppressConsoleLog) {
        console.error(errorMessage);
      }
    }
  }, [error]);
}
