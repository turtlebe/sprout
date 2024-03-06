import { Delete, DragIndicator, Edit } from '@material-ui/icons';
import { DraggableList, DraggableListItemRenderer, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box, IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { WorkcenterTaskDetails, WorkcenterTaskDetailsResponse } from '../../../common/types';
import { getDateFormat } from '../../../common/utils';
import { TaskIcon } from '../task-icon';
import { TaskTitle } from '../task-title';
import { TimelineTask } from '../timeline-task';

const dataTestIds = {
  taskItem: 'pending-tasks-draggable-list-task-item',
  taskItemTitle: 'pending-tasks-draggable-list-task-item-title',
  editTaskButton: 'pending-tasks-draggable-list-edit-task-button',
  deleteTaskButton: 'pending-tasks-draggable-list-delete-task-button',
};

export { dataTestIds as dataTestIdsPendingTaskDraggableList };

interface TaskListItem extends WorkcenterTaskDetailsResponse {
  id: string;
}

export interface PendingTasksDraggableList {
  plannedDate: Date;
  pendingTasks: WorkcenterTaskDetailsResponse[];
  workcenterPath: string;
  revalidateWorkcenterPlan: () => void;
  onEditTaskClick: (task: WorkcenterTaskDetails) => void;
  onDeleteTaskClick: (task: WorkcenterTaskDetails) => void;
}

/**
 * This component displays a list of pending tasks that supports item re-ordering.
 * The operations supported on the task list items include:
 *  1. re-ordering tasks - the backend will be updated when the order changes
 *  2. deleting tasks.
 *  3. editing tasks.
 */
export const PendingTasksDraggableList: React.FC<PendingTasksDraggableList> = ({
  plannedDate,
  pendingTasks,
  workcenterPath,
  revalidateWorkcenterPlan,
  onEditTaskClick,
  onDeleteTaskClick,
}) => {
  const snackbar = useGlobalSnackbar();

  const { makeRequest: updatePlan } = usePutRequest({
    url: '/api/plentyservice/executive-service/update-workcenter-plan',
  });

  function handleTaskOrderChanged(newTaskIdsOrder: TaskListItem[]) {
    updatePlan({
      data: {
        plannedDate: getDateFormat(plannedDate),
        workcenter: workcenterPath,
        taskOrdering: newTaskIdsOrder.map(task => task.id),
      },
      onSuccess: () => revalidateWorkcenterPlan(),
      onError: error => snackbar.errorSnackbar({ title: 'Error Updating Plan', message: parseErrorMessage(error) }),
    });
  }

  const renderPendingTaskItem = React.useCallback<DraggableListItemRenderer<TaskListItem>>(
    (task, index, dragPreview) => {
      return (
        <Box data-testid={dataTestIds.taskItem}>
          <TimelineTask
            key={task.taskDetails.id}
            showConnector={index !== pendingTasks.length - 1}
            taskIcon={<TaskIcon taskStatus={task.executionDetails?.taskStatus} />}
          >
            <div
              ref={dragPreview}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                transform: 'translate(0px, 0px)',
                backgroundColor: 'rgba(255, 165, 0,0.1)', // orange
              }}
            >
              <Box data-testid={dataTestIds.taskItemTitle} flex="1 1" display="flex">
                <DragIndicator style={{ alignSelf: 'center' }} />
                <TaskTitle task={task} />
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <IconButton
                  color="default"
                  data-testid={dataTestIds.editTaskButton}
                  icon={Edit}
                  onClick={() => onEditTaskClick(task.taskDetails)}
                />
                <IconButton
                  color="default"
                  data-testid={dataTestIds.deleteTaskButton}
                  icon={Delete}
                  onClick={() => onDeleteTaskClick(task.taskDetails)}
                />

                {/* 
                Comment out until this ticket is started: https://plentyag.atlassian.net/browse/SD-17308
                <Button color="default">Execute</Button> */}
              </Box>
            </div>
          </TimelineTask>
        </Box>
      );
    },
    [pendingTasks]
  );

  const pendingTaskWithIds = pendingTasks.map(taskData => ({ id: taskData.taskDetails.id, ...taskData }));

  return (
    <DraggableList<TaskListItem>
      onDrop={handleTaskOrderChanged}
      listItems={pendingTaskWithIds}
      listItemRenderer={renderPendingTaskItem}
      targetIdentifier="workcenter-pending-tasks-list"
    />
  );
};
