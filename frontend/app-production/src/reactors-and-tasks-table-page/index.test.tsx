import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mocktasks } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/test-helpers';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { dataTestIdsReactorsAndTasksTablePage as dataTestIds, ReactorsAndTasksTablePage } from '.';

import { useGetDurativeTasksByStatus } from './hooks/use-get-durative-tasks-by-status';

jest.mock('./hooks/use-get-durative-tasks-by-status');

describe('ReactorsAndTasksTablePage', () => {
  beforeEach(() => {
    (useGetDurativeTasksByStatus as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderReactorsAndTasksTablePage() {
    return render(<ReactorsAndTasksTablePage />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('renders loading initially', () => {
    // ARRANGE
    (useGetDurativeTasksByStatus as jest.Mock).mockReturnValue({
      tasks: null,
      refetch: jest.fn(),
      isLoading: true,
    });

    // ACT
    const { queryByTestId } = renderReactorsAndTasksTablePage();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });

  it('renders with data', async () => {
    // ARRANGE
    (useGetDurativeTasksByStatus as jest.Mock).mockReturnValue({
      tasks: mocktasks,
      refetch: jest.fn(),
      isLoading: false,
    });

    // ACT
    const { queryByTestId } = renderReactorsAndTasksTablePage();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
    await waitFor(() => expect(queryByTestId(dataTestIds.taskLink(mocktasks[0].taskInstance.id))).toBeInTheDocument());
    await waitFor(() => expect(queryByTestId(dataTestIds.taskLink(mocktasks[1].taskInstance.id))).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByTestId(dataTestIds.reactorLink(mocktasks[0].taskInstance.id))).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByTestId(dataTestIds.reactorLink(mocktasks[1].taskInstance.id))).toBeInTheDocument()
    );
  });

  it('refetches data when refresh button is pressed', async () => {
    // ARRANGE
    const mockRefetch = jest.fn();
    (useGetDurativeTasksByStatus as jest.Mock).mockReturnValue({
      tasks: mocktasks,
      refetch: mockRefetch,
      isLoading: false,
    });

    // ACT 1
    const { queryByTestId } = renderReactorsAndTasksTablePage();

    // ASSERT 1
    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton)).toBeEnabled());

    // ACT 2
    fireEvent.click(queryByTestId(dataTestIds.refreshButton));

    // ASSERT 2
    await waitFor(() => expect(mockRefetch).toHaveBeenCalled());
  });
});
