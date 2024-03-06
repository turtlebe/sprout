import { mockFarmStateContainer } from '@plentyag/app-production/src/common/test-helpers';
import { CreateUpdateBaseForm, dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useEditLoadedAtFormGenConfig, useLoadFarmStateBySerial } from '../../hooks';

import { dataTestIdsEditLoadedAt as dataTestIds, EditLoadedAt } from '.';

mockGlobalSnackbar();

jest.mock('../../hooks/use-edit-loaded-at-form-gen-config');
const mockUseEditLoadedAtFormGenConfig = useEditLoadedAtFormGenConfig as jest.Mock;

jest.mock('../../hooks/use-load-farm-state-by-serial');
const mockUseLoadFarmStateBySerial = useLoadFarmStateBySerial as jest.Mock;

jest.mock('@plentyag/brand-ui/src/components/create-update-base-form');
const mockCreateUpdateBaseForm = CreateUpdateBaseForm as jest.Mock;

describe('EditLoadedAt', () => {
  let mockRefresh, mockSubmitRequest;

  beforeEach(() => {
    mockCurrentUser({});

    mockRefresh = jest.fn().mockResolvedValue(true);
    mockUseLoadFarmStateBySerial.mockReturnValue({
      farmStateContainer: mockFarmStateContainer,
      revalidate: mockRefresh,
      isValidating: false,
    });
    mockUseEditLoadedAtFormGenConfig.mockReturnValue(null);

    mockSubmitRequest = jest.fn();
    mockCreateUpdateBaseForm.mockImplementation(({ onSuccess, onBeforeSubmit }) => {
      return (
        <>
          <button data-testid="mock-submit" onClick={onSuccess}>
            mock base form
          </button>
          <button
            data-testid="mock-before-submit"
            onClick={() =>
              onBeforeSubmit(
                {
                  originalObj: mockFarmStateContainer,
                  loadInGrowAt: '2009-04-16 11:11.111 -0700',
                },
                mockSubmitRequest
              )
            }
          >
            mock before submit
          </button>
        </>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderEditLoadedAt() {
    const { resourceState } = mockFarmStateContainer;
    return render(<EditLoadedAt resourceState={resourceState} onClose={jest.fn()} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders form, opens confirmation dialog, and handle success after submission', async () => {
    // ARRANGE
    mockUseEditLoadedAtFormGenConfig.mockReturnValue({
      title: 'Edit Loaded at date',
    });

    // ACT
    // -- inital rendering of the form
    const { queryByTestId } = renderEditLoadedAt();

    // ASSERT
    expect(queryByTestId('mock-before-submit')).toBeInTheDocument();

    // ACT 2
    // -- after user clicks "update", before submit is called to open confirmation dialog
    fireEvent.click(queryByTestId('mock-before-submit'));

    // ASSERT 2
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // ACT 3
    // -- user confirms "yes"
    fireEvent.click(queryByTestId(dataTestIdsDialogConfirmation.confirm));

    // ASSERT 3
    // -- first get the latest and submit request
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockSubmitRequest).toHaveBeenCalled();
    });
  });

  it('renders form, opens confirmation dialog, and closes up when user does not confirm', async () => {
    // ARRANGE
    mockUseEditLoadedAtFormGenConfig.mockReturnValue({
      title: 'Edit Loaded at date',
    });

    // ACT
    // -- inital rendering of the form
    const { queryByTestId } = renderEditLoadedAt();

    // ASSERT
    expect(queryByTestId('mock-before-submit')).toBeInTheDocument();

    // ACT 2
    // -- after user clicks "update", before submit is called to open confirmation dialog
    fireEvent.click(queryByTestId('mock-before-submit'));

    // ASSERT 2
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // ACT 3
    // -- user denies and cancels
    fireEvent.click(queryByTestId(dataTestIdsDialogConfirmation.cancel));

    // ASSERT 3
    // -- closed dialog box
    await waitFor(() => {
      expect(mockRefresh).not.toHaveBeenCalled();
      expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
    });
  });

  it('shows loading', () => {
    // ARRANGE
    mockUseLoadFarmStateBySerial.mockReturnValue({
      farmStateContainer: null,
      revalidate: mockRefresh,
      isValidating: true,
    });

    // ACT
    // -- inital rendering of the form
    const { queryByTestId } = renderEditLoadedAt();

    // ASSERT
    expect(queryByTestId('mock-before-submit')).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });

  it('shows "no editable field" message if no formgen object is defined', () => {
    // ARRANGE
    mockUseEditLoadedAtFormGenConfig.mockReturnValue(null);

    // ACT
    // -- inital rendering of the form
    const { queryByTestId } = renderEditLoadedAt();

    // ASSERT
    expect(queryByTestId('mock-before-submit')).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noEditableFields)).toBeInTheDocument();
  });
});
