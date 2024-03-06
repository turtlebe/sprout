import { usePutRequest } from '@plentyag/core/src/hooks';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { TaskStatus } from '../../../common/types';
import { getDateFormat } from '../../../common/utils';
import { mockSeedInProgressPlan } from '../../test-helpers';

import { dataTestIdsPendingTaskDraggableList as dataTestIds, PendingTasksDraggableList } from '.';

jest.mock('@plentyag/core/src/hooks');
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockMakePutRequest = jest.fn().mockImplementation(({ onSuccess }) => {
  onSuccess();
});
mockUsePutRequest.mockReturnValue({
  makeRequest: mockMakePutRequest,
});

const mockPendingTasks = mockSeedInProgressPlan.detailsOfTasksFromPlan.filter(
  task => task.executionDetails.taskStatus === TaskStatus.CREATED
);
const mockWorkcenterPath = mockSeedInProgressPlan.plan.workcenter;
const mockPlannedDate = new Date();

describe('PendingTasksDraggableList', () => {
  beforeEach(() => {
    mockUsePutRequest.mockClear();
    mockMakePutRequest.mockClear();
  });

  function renderPendingTasksDraggableList() {
    const mockRevalidateWorkcenterPlan = jest.fn();
    const mockOnEditTaskClick = jest.fn();
    const mockOnDeleteTaskClick = jest.fn();

    const result = render(
      <PendingTasksDraggableList
        plannedDate={mockPlannedDate}
        pendingTasks={mockPendingTasks}
        workcenterPath={mockWorkcenterPath}
        revalidateWorkcenterPlan={mockRevalidateWorkcenterPlan}
        onEditTaskClick={mockOnEditTaskClick}
        onDeleteTaskClick={mockOnDeleteTaskClick}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    return { ...result, mockRevalidateWorkcenterPlan, mockOnEditTaskClick, mockOnDeleteTaskClick };
  }

  it('renders a lists of pending tasks', () => {
    const { queryAllByTestId } = renderPendingTasksDraggableList();

    const taskItems = queryAllByTestId(dataTestIds.taskItemTitle);
    expect(taskItems).toHaveLength(mockPendingTasks.length);
  });

  it('calls "onEditTaskClick" callback with tasks details when edit button is clicked', () => {
    const { queryAllByTestId, mockOnEditTaskClick } = renderPendingTasksDraggableList();

    const taskEditButtons = queryAllByTestId(dataTestIds.editTaskButton);
    expect(taskEditButtons).toHaveLength(2);

    expect(mockOnEditTaskClick).not.toHaveBeenCalled();

    taskEditButtons[0].click();
    expect(mockOnEditTaskClick).toHaveBeenLastCalledWith(mockPendingTasks[0].taskDetails);
  });

  it('calls "onDeleteTaskClick" callback with task details when delete button is clicked', () => {
    const { queryAllByTestId, mockOnDeleteTaskClick } = renderPendingTasksDraggableList();

    const taskDeleteButtons = queryAllByTestId(dataTestIds.deleteTaskButton);
    expect(taskDeleteButtons).toHaveLength(2);

    expect(mockOnDeleteTaskClick).not.toHaveBeenCalled();

    taskDeleteButtons[1].click();
    expect(mockOnDeleteTaskClick).toHaveBeenLastCalledWith(mockPendingTasks[1].taskDetails);
  });

  it('re-orders the tasks', () => {
    const { queryAllByTestId, mockRevalidateWorkcenterPlan } = renderPendingTasksDraggableList();

    expect(mockRevalidateWorkcenterPlan).not.toHaveBeenCalled();

    const taskItems = queryAllByTestId(dataTestIds.taskItem);
    expect(taskItems).toHaveLength(2);
    const dragEl = taskItems[0];
    const dropEl = taskItems[1];

    // simulate drag-and-drop to re-order two items in list.
    fireEvent.dragStart(dragEl);
    fireEvent.dragOver(dropEl);
    fireEvent.drop(dropEl);

    const expectedReOrderedIds = [mockPendingTasks[1].taskDetails.id, mockPendingTasks[0].taskDetails.id];
    expect(mockMakePutRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          plannedDate: getDateFormat(mockPlannedDate),
          workcenter: mockWorkcenterPath,
          taskOrdering: expectedReOrderedIds,
        },
      })
    );

    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalled();
  });
});
