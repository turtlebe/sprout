import { dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components';
import { useDeleteRequest } from '@plentyag/core/src/hooks';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { dataTestIdsIrrigationActions as dataTestIds, DeleteTaskButton } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const makeDeleteRequest = jest.fn().mockImplementation(({ onSuccess }) => {
  onSuccess();
});
mockUseDeleteRequest.mockReturnValue({
  makeRequest: makeDeleteRequest,
  isLoading: false,
  error: null,
});

describe('DeleteTaskDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the delete task button', () => {
    const { queryByTestId } = render(<DeleteTaskButton taskId="123" onRefreshIrrigationTasks={jest.fn()} />);

    expect(queryByTestId(dataTestIds.delete)).toBeInTheDocument();
  });

  it('renders the dialog when the button is clicked', () => {
    const { queryByTestId } = render(<DeleteTaskButton taskId="123" onRefreshIrrigationTasks={jest.fn()} />);

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.delete).click();

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();
  });

  it('deletes the task, refreshes irrigation tasks and closes the dialog when confirm is clicked', async () => {
    const onRefreshIrrigationTasks = jest.fn();

    const { queryByTestId } = render(
      <DeleteTaskButton taskId="123" onRefreshIrrigationTasks={onRefreshIrrigationTasks} />
    );

    queryByTestId(dataTestIds.delete).click();

    queryByTestId(dataTestIdsDialogConfirmation.confirm).click();

    expect(makeDeleteRequest).toHaveBeenCalled();
    expect(onRefreshIrrigationTasks).toHaveBeenCalled();
    await waitFor(() => expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument());
  });
});
