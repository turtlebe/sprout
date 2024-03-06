import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';

interface PostData {
  plenty_username: string;
  lab_test_manual_field_name: string;
  lab_test_manual_field_value: boolean | null;
  lab_test_sample_id: string;
}

interface Response {
  details: any[];
  success: boolean;
  error?: string;
}

/**
 * This hooks creates a post request that allows manually updating a test result.
 * When the update succeeds, then calls swr update to replace row data in table.
 */
export const useManualCreateEvent = (onManualFieldChanged: () => void) => {
  const {
    data,
    isLoading,
    makeRequest,
    error: postError,
  } = usePostRequest<Response, PostData>({
    url: '/api/plentyservice/lab-testing-service/create-lab-test-event/manual',
  });

  function onSuccess(data: Response) {
    if (data && Array.isArray(data.details) && data.success) {
      if (data.details.length === 1) {
        onManualFieldChanged();
        return;
      }
      throw new Error('Unexpected number of updated samples, only exepected one.');
    }
  }

  const createEvent = (postData: PostData) => {
    return makeRequest({
      data: postData,
      onSuccess,
    });
  };

  let error: string | undefined = postError;
  if (data && data.error) {
    // even 200 ok might return error.
    error = data.error;
  }

  return { createEvent, isLoading, error };
};
