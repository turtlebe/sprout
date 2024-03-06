import { UploadFile } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { useUploadPlan } from '../../hooks';
import { mockWorkcenterTasksImports } from '../../test-helpers/mock-workcenter-tasks';

import { dataTestIdsUploadFileStep as dataTestIds, UploadFileStep } from '.';

jest.mock('../../hooks/use-upload-plan');
const mockUseUploadPlan = useUploadPlan as jest.Mock;

jest.mock('@plentyag/brand-ui/src/components/upload-file');
const mockUploadFile = UploadFile as jest.Mock;

describe('UploadFileStep', () => {
  let mockGoBack, mockSuccessUpload, mockUploadDataTestId;

  beforeEach(() => {
    mockGoBack = jest.fn();
    mockSuccessUpload = jest.fn();

    // mock upload hook
    mockUseUploadPlan.mockReturnValue({
      isUploadingPlan: false,
      makeUploadRequest: ({ onSuccess }) => {
        onSuccess(mockWorkcenterTasksImports);
      },
    });

    // mock upload component setup
    mockUploadDataTestId = 'fake-upload-file-test-id';
    mockUploadFile.mockImplementation(props => {
      const mockFile = new File(['mock-file'], 'mock-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      return (
        <button data-testid={mockUploadDataTestId} onClick={() => props.onSubmit(mockFile)}>
          fake upload
        </button>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderUploadFileStep(selectedWorkcenters) {
    return render(
      <UploadFileStep
        selectedWorkcenters={selectedWorkcenters}
        onGoBack={mockGoBack}
        onSuccessUpload={mockSuccessUpload}
      />
    );
  }

  it('render', () => {
    // ACT
    const { queryByTestId } = renderUploadFileStep(mockWorkcenterTasksImports);

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.nextButton)).toBeDisabled();
  });

  it('calls onGoBack when back button is pressed', () => {
    // ARRANGE
    const { queryByTestId } = renderUploadFileStep(mockWorkcenterTasksImports);

    // ACT
    queryByTestId(dataTestIds.backButton).click();

    // ASSERT
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('calls onSuccessUpload after upload is clicked', () => {
    // ARRANGE
    const { queryByTestId } = renderUploadFileStep(mockWorkcenterTasksImports);

    // ACT
    queryByTestId(mockUploadDataTestId).click();

    // ASSERT
    expect(mockSuccessUpload).toHaveBeenCalled();
  });

  it('makes sure on error that the next button is still disabled', () => {
    // ARRANGE
    mockUseUploadPlan.mockReturnValue({
      isUploadingPlan: false,
      makeUploadRequest: ({ onError }) => {
        onError();
      },
    });

    const { queryByTestId } = renderUploadFileStep(mockWorkcenterTasksImports);

    // ACT
    queryByTestId(mockUploadDataTestId).click();

    // ASSERT
    expect(mockSuccessUpload).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.nextButton)).toBeDisabled();
  });
});
