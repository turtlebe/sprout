import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsCollapsableTimelineTasks, DialogDeleteTask, DrawerCreateUpdateTask } from '..';
import { WorkcenterDetails, WorkcenterPlanResponse } from '../../../common/types';
import { mockPropLoadCompletedPlan, mockSeedInProgressPlan } from '../../test-helpers';
import { dataTestIdsPendingTaskDraggableList } from '../pending-tasks-draggable-list';

import { dataTestIdsPendingTasks as dataTestIds, PendingTasks } from '.';

function getWorkcenterName(workcenterPath: string) {
  const parts = workcenterPath.split('/');
  return parts[parts.length - 1];
}

jest.mock('../drawer-create-update-task');
const mockDrawerCreateUpdateTask = DrawerCreateUpdateTask as jest.Mock;
mockDrawerCreateUpdateTask.mockImplementation(props => {
  return (
    <button data-testid="fake-add-task" onClick={() => props.onSuccess()}>
      fake add task success
    </button>
  );
});

jest.mock('../dialog-delete-task');
const mockDialogDeleteTask = DialogDeleteTask as jest.Mock;
mockDialogDeleteTask.mockImplementation(props => {
  return (
    <button data-testid="fake-delete-task" onClick={() => props.onSuccess()}>
      fake delete task success
    </button>
  );
});

const mockWorkcenter = {
  actions: [
    {
      name: 'Load Table Into Prop From Clean Table Stack',
      path: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
    },
  ],
  name: getWorkcenterName(mockPropLoadCompletedPlan.plan.workcenter),
  path: mockPropLoadCompletedPlan.plan.workcenter,
  displayName: mockPropLoadCompletedPlan.plan.workcenter,
};

const mockSeedWorkcenter = {
  actions: [
    {
      name: 'Seed Trays And Load Table To Germ',
      path: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
    },
  ],
  name: getWorkcenterName(mockSeedInProgressPlan.plan.workcenter),
  path: mockSeedInProgressPlan.plan.workcenter,
  displayName: mockSeedInProgressPlan.plan.workcenter,
};

describe('PendingTasks', () => {
  afterEach(() => {
    mockDrawerCreateUpdateTask.mockClear();
  });

  function renderPendingTasks(
    mockWorkcenter: WorkcenterDetails,
    mockPlanResponse: WorkcenterPlanResponse,
    mockRevalidateWorkcenterPlan?: () => void
  ) {
    return render(
      <PendingTasks
        workcenter={mockWorkcenter}
        plannedDate={new Date()}
        planResponse={mockPlanResponse}
        revalidateWorkcenterPlan={mockRevalidateWorkcenterPlan}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );
  }

  it('shows CREATED tasks', () => {
    const mockSeedWorkcenterWithNoTasks = {
      actions: [
        // no tasks
      ],
      name: getWorkcenterName(mockSeedInProgressPlan.plan.workcenter),
      path: mockSeedInProgressPlan.plan.workcenter,
      displayName: mockSeedInProgressPlan.plan.workcenter,
    };
    const { queryByTestId } = renderPendingTasks(mockSeedWorkcenterWithNoTasks, mockSeedInProgressPlan);

    // there are two created tasks in mockSeedInProgressPlan
    expect(queryByTestId(dataTestIdsCollapsableTimelineTasks.timelineTaskItems).children).toHaveLength(2);
    expect(queryByTestId(dataTestIds.noTasksCanBeAddedMessage)).toBeInTheDocument();
  });

  it('show no tasks - since none have CREATED status', () => {
    const { queryByTestId } = renderPendingTasks(mockWorkcenter, mockPropLoadCompletedPlan);

    expect(queryByTestId(dataTestIdsCollapsableTimelineTasks.timelineTaskItems).children).toHaveLength(0);
    expect(queryByTestId(dataTestIds.singleAddTaskButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noTasksCanBeAddedMessage)).not.toBeInTheDocument();
  });

  it('shows disabled add tasks button - since plan is completed', () => {
    const { queryByTestId } = renderPendingTasks(mockWorkcenter, mockPropLoadCompletedPlan);

    expect(queryByTestId(dataTestIds.singleAddTaskButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.singleAddTaskButton)).toBeDisabled();
    expect(queryByTestId(dataTestIds.addTaskDropdown)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noTasksCanBeAddedMessage)).not.toBeInTheDocument();
  });

  it('shows enabled add tasks button - since plan is in progress (not completed)', () => {
    const { queryByTestId } = renderPendingTasks(mockSeedWorkcenter, mockSeedInProgressPlan);

    expect(queryByTestId(dataTestIds.singleAddTaskButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.singleAddTaskButton)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.addTaskDropdown)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noTasksCanBeAddedMessage)).not.toBeInTheDocument();
  });

  it('shows add tasks dropdown - when actions contains multiple tasks', () => {
    const mockPropLoadWorkcenter = {
      actions: [
        {
          name: 'Load Table Into Prop From Clean Table Stack',
          path: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
        },
        {
          name: 'Load Table Into Prop From Germ',
          path: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
        },
      ],
      name: getWorkcenterName(mockPropLoadCompletedPlan.plan.workcenter),
      path: mockPropLoadCompletedPlan.plan.workcenter,
      displayName: mockPropLoadCompletedPlan.plan.workcenter,
    };
    const { queryByTestId, queryAllByTestId } = renderPendingTasks(mockPropLoadWorkcenter, mockSeedInProgressPlan);

    expect(queryByTestId(dataTestIds.singleAddTaskButton)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.addTaskDropdown)).toBeInTheDocument();
    queryByTestId(dataTestIds.addTaskDropdown).click();
    const dropdownItems = queryAllByTestId(dataTestIds.addTaskDropdownItem);
    expect(dropdownItems).toHaveLength(2);
    expect(dropdownItems[0]).toHaveTextContent(mockPropLoadWorkcenter.actions[0].name);
    expect(dropdownItems[1]).toHaveTextContent(mockPropLoadWorkcenter.actions[1].name);

    expect(queryByTestId(dataTestIds.noTasksCanBeAddedMessage)).not.toBeInTheDocument();
  });

  it('opens the add task dialog when add task button is clicked', () => {
    const { queryByTestId } = renderPendingTasks(mockSeedWorkcenter, mockSeedInProgressPlan);

    expect(mockDrawerCreateUpdateTask).not.toHaveBeenCalledWith();

    queryByTestId(dataTestIds.singleAddTaskButton).click();

    expect(mockDrawerCreateUpdateTask).toHaveBeenLastCalledWith(
      expect.objectContaining({
        task: {
          isUpdating: false,
          taskPath: mockSeedWorkcenter.actions[0].path,
        },
      }),
      expect.anything()
    );
  });

  it('calls "revalidateWorkcenterPlan" when task is successfully added', () => {
    const mockRevalidateWorkcenterPlan = jest.fn();
    const { queryByTestId } = renderPendingTasks(
      mockWorkcenter,
      mockPropLoadCompletedPlan,
      mockRevalidateWorkcenterPlan
    );

    expect(mockRevalidateWorkcenterPlan).not.toHaveBeenCalled();

    queryByTestId('fake-add-task').click();

    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalled();
  });

  it('opens the create/update task dialog when edit button is clicked', () => {
    const { queryAllByTestId } = renderPendingTasks(mockSeedWorkcenter, mockSeedInProgressPlan);

    expect(mockDrawerCreateUpdateTask).not.toHaveBeenCalledWith();

    const editTaskButtons = queryAllByTestId(dataTestIdsPendingTaskDraggableList.editTaskButton);

    expect(editTaskButtons).toHaveLength(2);

    const mockTaskToEdit = mockSeedInProgressPlan.detailsOfTasksFromPlan[3];
    editTaskButtons[0].click();

    expect(mockDrawerCreateUpdateTask).toHaveBeenLastCalledWith(
      expect.objectContaining({
        task: {
          isUpdating: true,
          taskPath: mockTaskToEdit.taskDetails.taskPath,
          taskId: mockTaskToEdit.taskDetails.id,
          taskParametersJsonPayload: mockTaskToEdit.taskDetails.taskParametersJsonPayload,
        },
      }),
      expect.anything()
    );
  });

  it('opens dialog to delete task when clicking task delete button', () => {
    const mockRevalidateWorkcenterPlan = jest.fn();
    const { queryAllByTestId, queryByTestId } = renderPendingTasks(
      mockSeedWorkcenter,
      mockSeedInProgressPlan,
      mockRevalidateWorkcenterPlan
    );

    // dialog is not open, since no task id has been passed.
    expect(mockDialogDeleteTask).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskIdToDelete: undefined,
      }),
      {}
    );
    const deleteTaskButtons = queryAllByTestId(dataTestIdsPendingTaskDraggableList.deleteTaskButton);

    expect(deleteTaskButtons).toHaveLength(2);

    const mockTaskToDelete = mockSeedInProgressPlan.detailsOfTasksFromPlan[3];
    deleteTaskButtons[0].click();

    // dialog is now open since called with task id that was clicked to delete.
    expect(mockDialogDeleteTask).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskIdToDelete: mockTaskToDelete.taskDetails.id,
      }),
      {}
    );

    // click fake delete confirm.
    queryByTestId('fake-delete-task').click();

    // now dialog should be closed since onSuccess was called
    expect(mockDialogDeleteTask).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskIdToDelete: undefined,
      }),
      {}
    );

    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(1);
  });
});
