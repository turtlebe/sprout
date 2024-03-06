import { dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components/dialog-confirmation';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useDeleteRequest } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDeleteTask as dataTestIds, DialogDeleteTask } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;

const mockTaskId = '1c18babd-e0b8-4cdb-919d-dc9581c8edfb';

describe('DialogDeleteTask', () => {
  beforeEach(() => {
    mockUseDeleteRequest.mockReturnValue({
      isLoading: false,
      makeRequest: ({ onSuccess }) => {
        onSuccess();
      },
    });
  });

  function renderDialogDeleteTask(taskId: string) {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const result = render(
      <DialogDeleteTask taskIdToDelete={taskId} onCancel={mockOnCancel} onSuccess={mockOnSuccess} />
    );

    return { ...result, mockOnSuccess, mockOnCancel };
  }

  it('shows confirmation dialog before deleting', () => {
    const { queryByTestId } = renderDialogDeleteTask(mockTaskId);

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();
  });

  it('does not show confirmation dialog if task id not provided', () => {
    const { queryByTestId } = renderDialogDeleteTask(undefined);

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
  });

  it('deletes when confirmation given and calls "onSuccess"', () => {
    const { queryByTestId, mockOnSuccess, mockOnCancel } = renderDialogDeleteTask(mockTaskId);

    expect(mockOnSuccess).not.toHaveBeenCalled();

    queryByTestId(dataTestIdsDialogConfirmation.confirm).click();

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('calls "onCancel when user bails on delete', () => {
    const { queryByTestId, mockOnSuccess, mockOnCancel } = renderDialogDeleteTask(mockTaskId);

    expect(mockOnCancel).not.toHaveBeenCalled();

    queryByTestId(dataTestIdsDialogConfirmation.cancel).click();

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('shows error when delete fails', () => {
    mockUseDeleteRequest.mockReturnValue({
      isLoading: false,
      makeRequest: ({ onError }) => {
        onError('ouch');
      },
    });

    const { queryByTestId, mockOnSuccess, mockOnCancel } = renderDialogDeleteTask(mockTaskId);

    queryByTestId(dataTestIdsDialogConfirmation.confirm).click();

    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();

    expect(errorSnackbar).toHaveBeenCalledWith(expect.objectContaining({ message: 'ouch' }));
  });

  it('shows progress spinner while delete request is being processeed', () => {
    const mockMakeRequest = jest.fn();
    mockUseDeleteRequest.mockReturnValue({
      isLoading: true,
      makeRequest: mockMakeRequest,
    });

    const { queryByTestId } = renderDialogDeleteTask(mockTaskId);

    expect(queryByTestId(dataTestIds.deleteInProgress)).toBeInTheDocument();

    queryByTestId(dataTestIdsDialogConfirmation.confirm).click();

    // while delete request is in progress, clicking confirm won't make another request.
    expect(mockMakeRequest).not.toHaveBeenCalled();
  });

  it('does not show progress spinner when delete request is not being processed', () => {
    const { queryByTestId } = renderDialogDeleteTask(mockTaskId);

    expect(queryByTestId(dataTestIds.deleteInProgress)).not.toBeInTheDocument();
  });
});
