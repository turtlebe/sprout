import { mockAssessmentTypesRecord } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/test-helpers/mock-assessment-types';
import { dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components';
import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  dataTestIdsDeleteAssessmentTypeButton as dataTestIds,
  DeleteAssessmentTypeButton,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from '.';

jest.mock('@plentyag/core/src/hooks');
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
mockGlobalSnackbar();

describe('DeleteAssessmentTypeButton', () => {
  const mockAssessmentType = mockAssessmentTypesRecord.largeLeaves;
  const mockOnDelete = jest.fn();
  const mockMakeDeleteRequest = jest.fn();

  function setupMockUseDeleteRequest() {
    mockUseDeleteRequest.mockImplementation(() => ({
      makeRequest: mockMakeDeleteRequest,
    }));
  }

  afterEach(() => {
    jest.clearAllMocks(); // note: using resetAllMocks breaks mockGlobalSnackbar
  });

  function renderDeleteAssessmentTypeButton() {
    return render(<DeleteAssessmentTypeButton onDelete={mockOnDelete} assessmentType={mockAssessmentType} />);
  }

  it('shows button if permissions are set', () => {
    // ARRANGE
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    setupMockUseDeleteRequest();

    // ACT
    const { queryByTestId } = renderDeleteAssessmentTypeButton();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(mockUseDeleteRequest).toHaveBeenCalledWith({
      url: '/api/swagger/productqualityservice/postharvest-assessment-types-api/delete-postharvest-assessment-type/7ceefd77-f073-4675-a781-7c48f42e9c24',
      headers: { 'X-Deleted-By': 'olittle' },
    });
  });

  it('hides button if permissions are not set', () => {
    // ARRANGE
    mockCurrentUser();
    setupMockUseDeleteRequest();

    // ACT
    const { queryByTestId } = renderDeleteAssessmentTypeButton();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('should call onDelete() after user clicks and successfully deletes', async () => {
    // ARRANGE
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    mockMakeDeleteRequest.mockImplementation(({ onSuccess }) => onSuccess());
    setupMockUseDeleteRequest();
    const { queryByTestId } = renderDeleteAssessmentTypeButton();

    // ACT 1 -- click on icon
    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    // ASSERT 1 -- dialog box
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // ACT 2 -- click on confirm
    await actAndAwait(() => queryByTestId(dataTestIdsDialogConfirmation.confirm).click());

    // ASSERT 2 -- delete
    expect(successSnackbar).toHaveBeenCalledWith(SUCCESS_MESSAGE(mockAssessmentType.label));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('should error out after user clicks and delete fails', async () => {
    // ARRANGE
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    mockMakeDeleteRequest.mockImplementation(({ onError }) => onError());
    setupMockUseDeleteRequest();
    const { queryByTestId } = renderDeleteAssessmentTypeButton();

    // ACT 1 -- click on icon
    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    // ASSERT 1 -- dialog box
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // ACT 2 --  click on confirm
    await actAndAwait(() => queryByTestId(dataTestIdsDialogConfirmation.confirm).click());

    // ASSERT 2 -- error
    expect(errorSnackbar).toHaveBeenCalledWith({ message: ERROR_MESSAGE(mockAssessmentType.label) });
  });
});
