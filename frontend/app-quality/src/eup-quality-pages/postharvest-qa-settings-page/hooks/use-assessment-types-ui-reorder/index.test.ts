import { mockAssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/test-helpers/mock-assessment-types';
import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useAssessmentTypeUiReorder } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

describe('useAssessmentTypeUiReorder', () => {
  function renderUseAssessmentTypeUiReorder() {
    return renderHook(() => useAssessmentTypeUiReorder());
  }

  it('shows loading', () => {
    // ARRANGE
    mockUsePostRequest.mockReturnValue({
      makeRequest: jest.fn(),
      isLoading: true,
    });

    // ACT
    const { result } = renderUseAssessmentTypeUiReorder();

    // ASSERT
    expect(result.current.isLoading).toBeTruthy();
  });

  it('should call to make request, show success, and fire callback onSuccess on successful request', async () => {
    // ARRANGE
    const mockMakeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({
      makeRequest: mockMakeRequest,
      isLoading: false,
    });
    const mockOnSuccess = jest.fn();
    const { result } = renderUseAssessmentTypeUiReorder();

    // ACT
    await actAndAwait(() =>
      result.current.makeReorderRequest({
        assessmentTypes: mockAssessmentTypes,
        onSuccess: mockOnSuccess,
      })
    );

    // ASSERT
    expect(result.current.isLoading).toBeFalsy();
    expect(mockMakeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          ids: [
            '101b3314-5590-4f3d-8342-776249607bc3',
            '35d07805-6c54-4894-a2dc-00b0b3d3af45',
            '7ceefd77-f073-4675-a781-7c48f42e9c24',
            'e0d8a8cb-211a-48ab-92cd-388c98dd0618',
            'b573ecdd-92c6-4f36-bd67-2587f3ca27ac',
            'dad75884-c712-4fd4-863d-57603db2c8aa',
            'b9a796c5-490f-492f-b646-0fe442da447c',
          ],
        },
        onSuccess: expect.anything(),
        onError: expect.anything(),
      })
    );
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(successSnackbar).toHaveBeenCalledWith('Assessment Types new order saved!');
  });

  it('should show error and and fire callback onError on failed request', async () => {
    // ARRANGE
    mockUsePostRequest.mockReturnValue({
      makeRequest: jest.fn().mockImplementation(({ onError }) => onError()),
      isLoading: false,
    });
    const mockOnError = jest.fn();
    const { result } = renderUseAssessmentTypeUiReorder();

    // ACT
    await actAndAwait(() =>
      result.current.makeReorderRequest({
        assessmentTypes: mockAssessmentTypes,
        onSuccess: jest.fn(),
        onError: mockOnError,
      })
    );

    // ASSERT
    expect(result.current.isLoading).toBeFalsy();
    expect(mockOnError).toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledWith({ message: 'Order could not be saved!' });
  });
});
