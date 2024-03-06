import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { useGetState } from '../../hooks';
import { mocktasks } from '../../test-helpers';

jest.mock('../../hooks/use-get-state');
const mockUseGetState = useGetState as jest.Mock;

import { dataTestIdsTaskState as dataTestIds, TaskState } from '.';

const mockTaskId = '82917fc4-0ee1-460b-b0e8-eae6fb512033';

describe('TaskState', () => {
  function renderTaskState(taskId: string) {
    return render(<TaskState taskId={taskId} />, {
      wrapper: AppProductionTestWrapper,
    });
  }
  it('shows json view of task state', () => {
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mocktasks,
    });
    const { queryByTestId } = renderTaskState(mockTaskId);

    expect(queryByTestId(dataTestIds.jsonView)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noState)).not.toBeInTheDocument();
  });

  it('shows message when loaded state has no information', () => {
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: null,
    });
    const { queryByTestId } = renderTaskState(mockTaskId);

    expect(queryByTestId(dataTestIds.jsonView)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noState)).toBeInTheDocument();
  });
});
