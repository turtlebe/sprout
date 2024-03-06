import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { FarmDefWorkcenter } from '@plentyag/core/src/farm-def/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage, toQueryParams } from '@plentyag/core/src/utils';

import { UploadWorksheetErrorMessage } from '../../components/upload-worksheet-error-message';
import { UploadBulkCreateTasks } from '../../types';

export const ERROR_MUST_SELECTED_WORKCENTERS =
  'One or more workcenters must be selected before uploading workcenter plan file.';
export const ERROR_UPLOADING_TITLE = 'Error uploading workcenter plan file';

interface UseUploadPlan {
  selectedWorkcenters: FarmDefWorkcenter[];
}

export interface UseUploadPlanReturn {
  isUploadingPlan: boolean;
  makeUploadRequest: (payload: MakeUploadRequestParams) => void;
}

interface MakeUploadRequestParams {
  file: File;
  onSuccess: (uploadBulkCreateTasks: UploadBulkCreateTasks) => void;
  onError: (error: any) => void;
}

export const useUploadPlan = ({ selectedWorkcenters }: UseUploadPlan): UseUploadPlanReturn => {
  const snackbar = useGlobalSnackbar();

  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;

  const site = getKindFromPath(currentFarmDefPath, 'sites');
  const farm = getKindFromPath(currentFarmDefPath, 'farms');
  const sheets = selectedWorkcenters.map(workcenter => workcenter.name);

  const { isLoading: isUploadingPlan, makeRequest } = usePostRequest<UploadBulkCreateTasks, FormData>({
    url: `/api/production-admin/workcenters/upload-bulk-create-tasks-file${toQueryParams({
      site,
      farm,
      sheets,
    })}`,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  function makeUploadRequest({ file, onSuccess, onError }: MakeUploadRequestParams) {
    if (!selectedWorkcenters?.length) {
      snackbar.errorSnackbar({
        message: ERROR_MUST_SELECTED_WORKCENTERS,
      });
      return;
    }

    const form = new FormData();
    form.append('file', file);

    void makeRequest({
      data: form,
      onSuccess,
      onError: error => {
        const message =
          error?.status === 400 && error?.data?.upload_id ? (
            <UploadWorksheetErrorMessage errorData={error.data} />
          ) : (
            parseErrorMessage(error)
          );

        snackbar.errorSnackbar({ title: ERROR_UPLOADING_TITLE, message });
        onError(error);
      },
    });
  }

  return { isUploadingPlan, makeUploadRequest };
};
