import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { MakeRequestParams, usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils';

import { CreatedTask, UploadBulkCreateTasks, WorkcenterTasksImport } from '../../types';

export const ERROR_NO_TASKS_FOUND = 'One or more tasks needed to be confirmed to be imported';
export const WARNING_DO_NOT_CLOSE = 'Currently importing plans. Please do not close the browser while importing!';
export const ERROR_IMPORTING_PLANS = 'Error importing plans';

export interface UseImportPlansReturn {
  importPlans: (params?: MakeRequestParams<CreatedTask[], WorkcenterTasksImport[]>) => void;
  isProcessing: boolean;
}

/**
 *
 * @param {UploadBulkCreateTasks} uploadBulkCreateTasks
 * @returns {UseImportPlansReturn}
 */
export const useImportPlans = (uploadBulkCreateTasks: UploadBulkCreateTasks): UseImportPlansReturn => {
  const snackbar = useGlobalSnackbar();

  const { isLoading: isProcessing, makeRequest } = usePostRequest<CreatedTask[], UploadBulkCreateTasks>({
    url: '/api/production-admin/workcenters/confirm-bulk-create-tasks',
  });

  function importPlans({ onSuccess }) {
    if (!uploadBulkCreateTasks) {
      snackbar.errorSnackbar({
        message: ERROR_NO_TASKS_FOUND,
      });
      return;
    }

    // warn users to not close their browsers as it's processing
    snackbar.warningSnackbar(WARNING_DO_NOT_CLOSE);

    void makeRequest({
      data: uploadBulkCreateTasks,
      onSuccess: res => {
        snackbar.closeSnackbar();
        onSuccess(res);
      },
      onError: error => {
        snackbar.errorSnackbar({ title: ERROR_IMPORTING_PLANS, message: parseErrorMessage(error) });
      },
    });
  }

  return {
    importPlans,
    isProcessing,
  };
};
