import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components';
import { render, waitFor } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { RunningTask } from '../../../common/components';
import { TaskStatus } from '../../../common/types';
import { useCancelTask, useGetState } from '../../hooks';
import { mocktasks } from '../../test-helpers';

import { dataTestIdsTaskProgress as dataTestIds, TaskProgress } from '.';

jest.mock('../../hooks/use-get-state');
const mockUseGetState = useGetState as jest.Mock;

jest.mock('../../hooks/use-cancel-task');
const mockUseCancelTask = useCancelTask as jest.Mock;
const mockCancelTask = jest.fn();
mockUseCancelTask.mockReturnValue({
  cancelTask: mockCancelTask,
  isCanceling: false,
});

jest.mock('../../../common/components/running-task');
const mockRunningTask = RunningTask as jest.Mock;
mockRunningTask.mockImplementation(() => <div>mock running task progress</div>);

const mockTaskId = '82917fc4-0ee1-460b-b0e8-eae6fb512033';
const mockReactorPath = 'sites/LAX1/farms/LAX1/workCenters/Seed';

describe('TaskProgress', () => {
  beforeEach(() => {
    mockRunningTask.mockClear();
    mockCancelTask.mockClear();
    mockUseGetState.mockClear();
  });

  function buildMockTask() {
    return cloneDeep(mocktasks[0]);
  }

  function renderTaskWithStatus(status: TaskStatus) {
    const mockTask = buildMockTask();
    mockTask.taskStatus = status;
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mockTask,
    });
    const result = render(<TaskProgress taskId={mockTask.taskInstance.id} />, { wrapper: AppProductionTestWrapper });

    return { ...result, mockTask };
  }

  function renderTaskWithId(taskId: string) {
    return render(<TaskProgress taskId={taskId} reactorPath={mockReactorPath} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows message when there is no state for given task id', () => {
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: null,
    });
    const { queryByTestId } = renderTaskWithId(mockTaskId);

    expect(queryByTestId(dataTestIds.noState)).toBeInTheDocument();
    expect(mockRunningTask).not.toHaveBeenCalled();
  });

  it('shows the task state for a running task', () => {
    const { queryByTestId, mockTask } = renderTaskWithStatus(TaskStatus.RUNNING);

    expect(queryByTestId(dataTestIds.noState)).not.toBeInTheDocument();
    expect(mockRunningTask).toHaveBeenCalledWith(
      expect.objectContaining({
        task: mockTask,
        title: expect.stringContaining(mockTask.taskInstance.displayTitle),
      }),
      expect.anything()
    );
  });

  it('does not show running task state for cancelled task', () => {
    renderTaskWithStatus(TaskStatus.CANCELED);
    expect(mockRunningTask).not.toHaveBeenCalled();
  });

  it('does not show running task state for completed task', () => {
    renderTaskWithStatus(TaskStatus.COMPLETED);
    expect(mockRunningTask).not.toHaveBeenCalled();
  });

  it('does not show running task state for failed task', () => {
    renderTaskWithStatus(TaskStatus.FAILED);
    expect(mockRunningTask).not.toHaveBeenCalled();
  });

  it('does not show running task state for created task', () => {
    renderTaskWithStatus(TaskStatus.CREATED);
    expect(mockRunningTask).not.toHaveBeenCalled();
  });

  it('hides cancel button when there is no task data', () => {
    const mockTask = buildMockTask();
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: null,
    });
    const { queryByTestId } = renderTaskWithId(mockTask.taskInstance.id);

    // confirm dialog not shown yet
    expect(queryByTestId(dataTestIds.cancelButton)).not.toBeInTheDocument();
  });

  it.each([
    ['hides', TaskStatus.COMPLETED],
    ['hides', TaskStatus.CANCELED],
    ['hides', TaskStatus.CANCELLING],
    ['hides', TaskStatus.FAILED],
    ['shows', TaskStatus.RUNNING],
    ['shows', TaskStatus.QUEUED],
    ['shows', TaskStatus.CREATED],
  ])('%s cancel button when status %s', (hideShow, status) => {
    const mockTask = buildMockTask();
    mockTask.taskStatus = TaskStatus[status];
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mockTask,
    });
    const { queryByTestId } = renderTaskWithId(mockTask.taskInstance.id);

    // hide for this status
    if (hideShow === 'hides') {
      expect(queryByTestId(dataTestIds.cancelButton)).not.toBeInTheDocument();

      // OR show for this status
    } else {
      expect(queryByTestId(dataTestIds.cancelButton)).toBeInTheDocument();
    }
  });

  it('shows confirm dialog when hitting cancel task button and clicking confirm cancels the task', async () => {
    const mockTask = buildMockTask();
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mockTask,
    });
    const { queryByTestId } = renderTaskWithId(mockTask.taskInstance.id);

    // confirm dialog not shown yet
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();

    // hitting cancel button should open confirm dialog
    queryByTestId(dataTestIds.cancelButton).click();
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // hitting confirm button in dialog should close dialog and call cancelTask
    queryByTestId(dataTestIdsDialogConfirmation.confirm).click();
    await waitFor(() => expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument());
    expect(mockCancelTask).toHaveBeenCalledTimes(1);
  });

  it('shows the parent task id and link when task has a parent', () => {
    const mockTask = buildMockTask();
    const mockParentTaskId = 'mock-parent-task-id';
    mockTask.taskInstance.parentTaskId = mockParentTaskId;
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mockTask,
    });
    const { queryByTestId } = renderTaskWithId(mockTask.taskInstance.id);

    expect(queryByTestId(dataTestIds.taskParent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.taskParent)).toHaveTextContent(mockParentTaskId);
  });

  it('does not show the parent task id and link when task has no parent', () => {
    const mockTask = buildMockTask();
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mockTask,
    });
    const { queryByTestId } = renderTaskWithId(mockTask.taskInstance.id);
    expect(queryByTestId(dataTestIds.taskParent)).not.toBeInTheDocument();
  });
});
