import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockFarmDefSiteObj } from '@plentyag/core/src/farm-def/test-helpers';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { ConfirmStep, FinishedStep, SelectWorkcentersStep, UploadFileStep } from '../';
import { useImportPlans } from '../../hooks';

import { dataTestIdsImportPlansModule as dataTestIds, ImportPlansModule } from '.';

jest.mock('../../hooks/use-import-plans');
const mockUseImportPlans = useImportPlans as jest.Mock;

jest.mock('../select-workcenters-step');
const mockSelectWorkcentersStep = SelectWorkcentersStep as jest.Mock;

jest.mock('../upload-file-step');
const mockUploadFileStep = UploadFileStep as jest.Mock;

jest.mock('../confirm-step');
const mockConfirmStep = ConfirmStep as jest.Mock;

jest.mock('../finished-step');
const mockFinishedStep = FinishedStep as jest.Mock;

mockGlobalSnackbar();

describe('ImportPlansModule', () => {
  let mockOnSuccess,
    mockOnError,
    mockImportPlans,
    mockWorkcenters,
    mockSelectWorkcentersDataTestId,
    mockUploadBackDataTestId,
    mockUploadDataTestId,
    mockConfirmBackTestId,
    mockConfirmTestId,
    mockFinishedTestId;

  beforeEach(() => {
    // ARRANGE
    mockOnSuccess = jest.fn();
    mockOnError = jest.fn();
    mockImportPlans = jest.fn();

    // -- mock workcenters
    mockWorkcenters = Object.values(mockFarmDefSiteObj.workCenters);

    // -- mock use import hook
    mockUseImportPlans.mockReturnValue({
      importPlans: mockImportPlans,
      isProcessing: false,
    });

    // -- mock select workcenters setup
    mockSelectWorkcentersDataTestId = 'fake-select-workcenter-test-id';
    mockSelectWorkcentersStep.mockImplementation(props => {
      return (
        <button
          data-testid={mockSelectWorkcentersDataTestId}
          onClick={() => props.onSelectedWorkcentersSubmit(mockWorkcenters)}
        >
          fake submit workcenters
        </button>
      );
    });

    // - mock upload setup
    mockUploadDataTestId = 'fake-upload-file-test-id';
    mockUploadBackDataTestId = 'fake-upload-back-test-id';
    mockUploadFileStep.mockImplementation(props => {
      const mockFile = new File(['mock-file'], 'mock-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // TODO: put a mock response from api here
      const mockResponse = null;
      return (
        <>
          <button data-testid={mockUploadBackDataTestId} onClick={() => props.onGoBack()}>
            go back
          </button>
          <button data-testid={mockUploadDataTestId} onClick={() => props.onSuccessUpload(mockFile, mockResponse)}>
            fake upload
          </button>
        </>
      );
    });

    // -- mock confirm step
    mockConfirmTestId = 'fake-confirm--test-id';
    mockConfirmBackTestId = 'fake-confirm-back-test-id';
    mockConfirmStep.mockImplementation(props => {
      return (
        <>
          <button data-testid={mockConfirmBackTestId} onClick={() => props.onGoBack()}>
            go back
          </button>
          <button data-testid={mockConfirmTestId} onClick={() => props.onConfirm()}>
            fake confirm
          </button>
        </>
      );
    });

    // -- mock finished step
    mockFinishedTestId = 'fake-finished-test-id';
    mockFinishedStep.mockImplementation(props => {
      return (
        <>
          <button data-testid={mockFinishedTestId} onClick={() => props.onReset()}>
            start over
          </button>
        </>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    successSnackbar.mockRestore();
  });

  function renderImportPlansModule() {
    return render(<ImportPlansModule onSuccess={mockOnSuccess} onError={mockOnError} />);
  }

  it('renders and initially show the select workcenter step', () => {
    // ACT
    const { queryByTestId } = renderImportPlansModule();

    // ASSERT
    // -- show component
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();

    // -- show only select workcenters
    expect(queryByTestId(mockSelectWorkcentersDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockUploadDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockConfirmTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockFinishedTestId)).not.toBeInTheDocument();
  });

  it('shows upload step after select workcenter step and able to go back', async () => {
    // ARRANGE
    const { queryByTestId } = renderImportPlansModule();

    // ACT
    fireEvent.click(queryByTestId(mockSelectWorkcentersDataTestId));

    // ASSERT
    await waitFor(() => {
      // -- show only upload step
      expect(queryByTestId(mockSelectWorkcentersDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockUploadDataTestId)).toBeInTheDocument();
      expect(queryByTestId(mockConfirmTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockFinishedTestId)).not.toBeInTheDocument();

      // -- show selection
      expect(queryByTestId(dataTestIds.selectWorkcentersStepSelection).textContent).toEqual(
        'Harvest, Pack, PropLoad, PropUnload, Seed, Transplant'
      );
    });

    // ACT 2
    await waitFor(() => fireEvent.click(queryByTestId(mockUploadBackDataTestId)));

    // ASSERT 2
    await waitFor(() => {
      // -- show select workcenters
      expect(queryByTestId(mockSelectWorkcentersDataTestId)).toBeInTheDocument();
      expect(queryByTestId(mockUploadDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockConfirmTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockFinishedTestId)).not.toBeInTheDocument();
    });
  });

  it('shows confirm step after upload step and able to go back', async () => {
    // ARRANGE
    const { queryByTestId } = renderImportPlansModule();

    // ACT
    fireEvent.click(queryByTestId(mockSelectWorkcentersDataTestId));
    fireEvent.click(queryByTestId(mockUploadDataTestId));

    // ASSERT
    // -- show only confirm step
    await waitFor(() => {
      expect(queryByTestId(mockSelectWorkcentersDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockUploadDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockConfirmTestId)).toBeInTheDocument();
      expect(queryByTestId(mockFinishedTestId)).not.toBeInTheDocument();

      // -- show upload file
      expect(queryByTestId(dataTestIds.uploadStepFile).textContent).toEqual('mock-file.xlsx');
    });

    // ACT 2
    await waitFor(() => fireEvent.click(queryByTestId(mockConfirmBackTestId)));

    // ASSERT 2
    // -- show upload step
    await waitFor(() => {
      expect(queryByTestId(mockSelectWorkcentersDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockUploadDataTestId)).toBeInTheDocument();
      expect(queryByTestId(mockConfirmTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockFinishedTestId)).not.toBeInTheDocument();
    });
  });

  it('should show backdrop when processing import', () => {
    // ARRANGE
    // -- mock processing
    mockUseImportPlans.mockReturnValue({
      importPlans: mockImportPlans,
      isProcessing: true,
    });

    // ACT
    const { queryByTestId } = renderImportPlansModule();

    // ASSERT
    expect(queryByTestId(dataTestIds.processing)).toBeInTheDocument();
  });

  it('should show snackbar and show import submitted step after confirm step and reset when done is clicked', async () => {
    // ARRANGE
    const { queryByTestId } = renderImportPlansModule();
    mockImportPlans.mockImplementation(({ onSuccess }) => {
      onSuccess();
    });

    // ACT
    fireEvent.click(queryByTestId(mockSelectWorkcentersDataTestId));
    fireEvent.click(queryByTestId(mockUploadDataTestId));
    fireEvent.click(queryByTestId(mockConfirmTestId));

    // ASSERT
    expect(successSnackbar).toHaveBeenCalledTimes(1);

    // -- show only import submitted step
    await waitFor(() => {
      expect(queryByTestId(mockSelectWorkcentersDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockUploadDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockConfirmTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockFinishedTestId)).toBeInTheDocument();
    });

    // ACT 2
    await waitFor(() => fireEvent.click(queryByTestId(mockFinishedTestId)));

    // -- show select workcenters
    await waitFor(() => {
      expect(queryByTestId(mockSelectWorkcentersDataTestId)).toBeInTheDocument();
      expect(queryByTestId(mockUploadDataTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockConfirmTestId)).not.toBeInTheDocument();
      expect(queryByTestId(mockFinishedTestId)).not.toBeInTheDocument();
    });
  });
});
