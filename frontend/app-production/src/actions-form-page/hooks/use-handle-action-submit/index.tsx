import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { generatePdf } from '@plentyag/core/src/utils';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { notifyProductionActionHasCompleted } from '../../utils';

export const SUCCESS_MESSAGE = 'Success submitting action';
export const FAIL_MESSAGE = 'Error submitting action';
export const DOWNLOAD_PDF_MESSAGE = 'Download generated PDF ';
export const BASE64_PDF_DATA_TYPE = 'base64/pdf';

export interface UseHandleActionSubmitReturn {
  handleSuccess: (response: unknown) => void;
  handleError: (error: any) => void;
  hasSubmitted: boolean;
}

export const useHandleActionSubmit = (): UseHandleActionSubmitReturn => {
  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>(false);
  const snackbar = useGlobalSnackbar();
  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  function handleSuccess(response) {
    setHasSubmitted(true);
    if (response.data && response.dataType === BASE64_PDF_DATA_TYPE) {
      const blobUrl = generatePdf(response.data);
      snackbar.successSnackbar(
        <span>
          {DOWNLOAD_PDF_MESSAGE}
          <PlentyLink to={blobUrl} isReactRouterLink={false} download={response.dataTitle}>
            {response.dataTitle}
          </PlentyLink>
        </span>,
        { disableAutoHide: true }
      );
    } else if (response.success && typeof response.message === 'string') {
      snackbar.successSnackbar(SUCCESS_MESSAGE + ': ' + response.message);
    } else {
      const reactorPath =
        response?.taskExecutorPath &&
        getReactorsAndTasksDetailPath({
          reactorsAndTasksDetailBasePath,
          reactorPath: response?.taskExecutorPath,
          taskId: response.taskId,
        });
      const reactorPathLinkMessage = reactorPath
        ? `
  
  <InternalLink href="${reactorPath}" >View Reactor State</InternalLink>`
        : '';
      snackbar.successSnackbar(SUCCESS_MESSAGE + reactorPathLinkMessage);
    }
    notifyProductionActionHasCompleted(200, '');
  }

  function handleError(err) {
    const responseCode = err.status || 500;
    const errorMessage = parseErrorMessage(err);
    snackbar.errorSnackbar({ message: `${FAIL_MESSAGE}: ${errorMessage}` });
    notifyProductionActionHasCompleted(responseCode, errorMessage);
  }

  return { handleSuccess, hasSubmitted, handleError };
};
