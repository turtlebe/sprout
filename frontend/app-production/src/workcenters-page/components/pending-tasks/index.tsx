import { Dropdown, DropdownItem, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { CollapsableTimelineTasks, DialogDeleteTask, DrawerCreateUpdateTask } from '..';
import {
  CreateOrUpdateTask,
  PlanStatus,
  WorkcenterDetails,
  WorkcenterPlanResponse,
  WorkcenterTaskDetails,
} from '../../../common/types';
import { isTaskPending } from '../../utils';
import { PendingTasksDraggableList } from '../pending-tasks-draggable-list';

const dataTestIds = {
  singleAddTaskButton: 'pending-tasks-single-add-task-button',
  addTaskDropdown: 'pending-tasks-single-add-task-dropdown',
  addTaskDropdownItem: 'pending-tasks-single-add-task-dropdown-item',
  noTasksCanBeAddedMessage: 'pending-tasks-no-tasks-message',
  editTaskButton: 'pending-tasks-edit-task-button',
  deleteTaskButton: 'pending-tasks-delete-task-button',
};

export { dataTestIds as dataTestIdsPendingTasks };

export interface PendingTasks {
  workcenter: WorkcenterDetails;
  plannedDate: Date;
  planResponse?: WorkcenterPlanResponse;
  revalidateWorkcenterPlan: () => void;
}

/**
 * This component shows workcenter tasks that have not started execution - these
 * tasks have status: CREATED. This component also also user to add new tasks
 * to the workcenter plan.
 */
export const PendingTasks: React.FC<PendingTasks> = ({
  workcenter,
  plannedDate,
  planResponse,
  revalidateWorkcenterPlan,
}) => {
  const [taskToCreateOrUpdate, setTaskToCreateOrUpdate] = React.useState<CreateOrUpdateTask>();
  const [taskIdToDelete, setTaskIdToDelete] = React.useState<string>();

  const tasks = planResponse?.detailsOfTasksFromPlan?.filter(task => task.taskDetails);

  const isPlanCompleted = planResponse?.plan.status === PlanStatus.COMPLETED;

  const addTaskButtons =
    workcenter?.actions?.length > 0 ? (
      <>
        {workcenter?.actions && workcenter.actions.length === 1 && (
          <Button
            data-testid={dataTestIds.singleAddTaskButton}
            variant="contained"
            disabled={isPlanCompleted}
            onClick={() => setTaskToCreateOrUpdate({ taskPath: workcenter.actions[0].path, isUpdating: false })}
          >
            Add Task
          </Button>
        )}
        {workcenter?.actions && workcenter.actions.length > 1 && (
          <Dropdown
            variant="contained"
            data-testid={dataTestIds.addTaskDropdown}
            disabled={isPlanCompleted}
            label="Add Task"
          >
            {workcenter.actions.map(action => (
              <DropdownItem key={action.name} data-testid={dataTestIds.addTaskDropdownItem}>
                <DropdownItemText onClick={() => setTaskToCreateOrUpdate({ taskPath: action.path, isUpdating: false })}>
                  {action.name}
                </DropdownItemText>
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </>
    ) : (
      <Typography data-testid={dataTestIds.noTasksCanBeAddedMessage}>
        Workcenter contains no tasks that can be added.
      </Typography>
    );

  const pendingTasks = tasks ? tasks.filter(task => isTaskPending(task)) : [];

  function handleEditTaskClick(taskDetails: WorkcenterTaskDetails) {
    setTaskToCreateOrUpdate({
      taskPath: taskDetails.taskPath,
      isUpdating: true,
      taskParametersJsonPayload: taskDetails.taskParametersJsonPayload,
      taskId: taskDetails.id,
    });
  }

  function handleDeleteTaskClick(taskDetails: WorkcenterTaskDetails) {
    setTaskIdToDelete(taskDetails.id);
  }

  return (
    <>
      <CollapsableTimelineTasks
        title={`Pending (${pendingTasks.length})`}
        defaultTimelineIconColor="orange"
        showHeaderConnectorWhenCollapsed={false}
        showHeaderConnector={pendingTasks.length > 0}
      >
        <PendingTasksDraggableList
          plannedDate={plannedDate}
          pendingTasks={pendingTasks}
          workcenterPath={workcenter?.path}
          revalidateWorkcenterPlan={revalidateWorkcenterPlan}
          onEditTaskClick={handleEditTaskClick}
          onDeleteTaskClick={handleDeleteTaskClick}
        />
      </CollapsableTimelineTasks>
      <Box>{addTaskButtons}</Box>
      <DrawerCreateUpdateTask
        task={taskToCreateOrUpdate}
        plan={planResponse?.plan}
        plannedDate={plannedDate}
        workcenterPath={workcenter?.path}
        onClose={() => setTaskToCreateOrUpdate(null)}
        onSuccess={() => revalidateWorkcenterPlan()}
      />
      <DialogDeleteTask
        taskIdToDelete={taskIdToDelete}
        onCancel={() => setTaskIdToDelete(undefined)}
        onSuccess={() => {
          setTaskIdToDelete(undefined);
          revalidateWorkcenterPlan();
        }}
      />
    </>
  );
};
