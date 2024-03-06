import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';

export interface UseCancelTask {
  taskId: string;
  reactorPath: string;
  onSuccess: () => void;
}

export interface UseCancelTaskReturn {
  cancelTask: () => void;
  isCanceling: boolean;
}

interface CancelTaskRequest {
  taskId: string;
  reactorPath: string;
}

const CANCEL_REQUEST_URL = '/api/plentyservice/executive-service/cancel-reactor-task';

export const useCancelTask = ({ taskId, reactorPath, onSuccess }: UseCancelTask): UseCancelTaskReturn => {
  const snackbar = useGlobalSnackbar();
  const { makeRequest, isLoading: isCanceling } = usePostRequest<unknown, CancelTaskRequest>({
    url: CANCEL_REQUEST_URL,
  });

  function cancelTask() {
    makeRequest({
      data: {
        taskId,
        reactorPath,
      },
      onSuccess,
      onError: error => {
        snackbar.errorSnackbar({ title: 'Error attempting to cancel task', message: parseErrorMessage(error) });
      },
    });
  }

  return { cancelTask, isCanceling };
};
