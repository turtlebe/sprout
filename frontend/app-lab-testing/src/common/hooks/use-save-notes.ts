import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';

interface PostData {
  plenty_username: string;
  lab_test_sample_id: string;
  notes: string;
}

interface Response {
  success: boolean;
}

/**
 * This hooks creates a post request that allows updates notes field.
 */
export const useSaveNotes = () => {
  const { isLoading: isSaving, makeRequest: saveNotes } = usePostRequest<Response, PostData>({
    url: '/api/plentyservice/lab-testing-service/create-lab-test-event/notes',
  });
  return { saveNotes, isSaving };
};
