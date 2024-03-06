import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';

export function useGetFarmDefObjectByPath(path: string, depth = 0) {
  const snackbar = useGlobalSnackbar();

  function onError(err: any) {
    snackbar.errorSnackbar({ message: `Error getting farm def path ${path}: ${parseErrorMessage(err)}` });
  }

  return useSwrAxios<FarmDefObject>(
    Boolean(path) && { url: `/api/plentyservice/farm-def-service/get-object-by-path?path=${path}&depth=${depth}` },
    { onError }
  );
}
