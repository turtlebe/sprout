import { UPDATE_ASSESSMENT_TYPE_UI_ORDER_URL } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { AssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';

export interface MakeReorderRequest {
  assessmentTypes: AssessmentTypes[];
  onSuccess?: () => void;
  onError?: (e?: Error) => void;
}
export interface UseAssessmentTypeUiReorderReturn {
  isLoading: boolean;
  makeReorderRequest: (request: MakeReorderRequest) => void;
}

export const useAssessmentTypeUiReorder = (): UseAssessmentTypeUiReorderReturn => {
  const snackbar = useGlobalSnackbar();

  const { makeRequest, isLoading } = usePostRequest({
    url: UPDATE_ASSESSMENT_TYPE_UI_ORDER_URL,
  });

  const makeReorderRequest = ({ assessmentTypes, onSuccess = () => {}, onError = () => {} }: MakeReorderRequest) => {
    makeRequest({
      data: { ids: assessmentTypes.map(({ id }) => id) },
      onSuccess: () => {
        snackbar.successSnackbar('Assessment Types new order saved!');
        onSuccess();
      },
      onError: e => {
        snackbar.errorSnackbar({ message: 'Order could not be saved!' });
        onError(e);
      },
    });
  };

  return {
    isLoading,
    makeReorderRequest,
  };
};
