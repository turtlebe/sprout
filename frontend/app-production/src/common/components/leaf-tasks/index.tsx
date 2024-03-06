import { AccessTime, Person, Spa } from '@material-ui/icons';
import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { WORKCENTER_REFRESH_PERIOD, WORKSPACE_TASKS_SEARCH_QUERY_PARAM } from '@plentyag/app-production/src/constants';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import { Box, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useRunActionPeriodicallyWhenVisible } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { toQueryParams } from '@plentyag/core/src/utils';
import React from 'react';

import { AccordionTaskList } from '..';
import { DurativeTaskState } from '../../../common/types';
import { isWorkbinTaskInstance } from '../../types';
import { taskDuration, taskRunningTime } from '../../utils';

const dataTestIds = {
  taskListItem: 'leaf-tasks-task-list-item',
  taskTitle: 'leaf-tasks-task-title',
  taskRunningTime: 'leaf-tasks-running-time',
  taskStatus: 'leaf-tasks-status',
  workbinTaskLink: 'leaf-workbin-tasks-link',
  workbinTaskIcon: 'leaf-tasks-workbin-task-icon',
  longRunningTaskIcon: 'leaf-tasks-long-running-task-icon',
  reactorsAndTasksLink: 'leaft-tasks-reactors-and-tasks-link',
};

export { dataTestIds as dataTestIdsLeafTasks };

export interface LeafTasks {
  taskId: string;
  isTaskListDefaultExpanded?: boolean;
}

export const TASK_TIMEOUT_WARNING_MINUTES = 5;

/**
 * This component renders the leaf tasks associated with the given workcenter "taskId".
 * Leaf tasks are displayed to the user because they are the task that will be currently
 * executing (since they are at the bottom of the tree of reactor tasks).
 * The list is periodically updated.
 */
export const LeafTasks: React.FC<LeafTasks> = ({ taskId, isTaskListDefaultExpanded }) => {
  const { workspacesBasePath, reactorsAndTasksDetailBasePath } = useAppPaths();

  const {
    data: tasks,
    isValidating: isLoading,
    revalidate,
  } = useSwrAxios<DurativeTaskState[]>({
    url: taskId && '/api/plentyservice/executive-service/get-all-durative-leaf-tasks-by-id',
    params: { task_id: taskId },
  });

  useRunActionPeriodicallyWhenVisible({
    condition: () => taskId && !isLoading,
    action: async () => revalidate(),
    period: WORKCENTER_REFRESH_PERIOD,
  });

  function renderTaskListItem(task: DurativeTaskState) {
    const instance = task.taskInstance;
    const taskName = isWorkbinTaskInstance(instance) ? (
      <>
        Workbin Task:{' '}
        <PlentyLink
          data-testid={dataTestIds.workbinTaskLink}
          to={`${workspacesBasePath}/${instance.taskDetails.workbin}${toQueryParams({
            [WORKSPACE_TASKS_SEARCH_QUERY_PARAM]: task.taskInstance.id,
          })}`}
        >
          {instance.displayTitle}
        </PlentyLink>
      </>
    ) : (
      <>
        {task.taskInstance.displayTitle}{' '}
        <PlentyLink
          data-testid={dataTestIds.reactorsAndTasksLink}
          to={getReactorsAndTasksDetailPath({
            reactorsAndTasksDetailBasePath,
            reactorPath: task.executingReactorPath,
            taskId: task.taskInstance.id,
          })}
        >
          details
        </PlentyLink>
      </>
    );

    return (
      <Box data-testid={dataTestIds.taskListItem}>
        <Typography data-testid={dataTestIds.taskTitle}>{taskName}</Typography>
        <Typography data-testid={dataTestIds.taskRunningTime} variant="subtitle2">
          running time: {taskRunningTime(task)}
        </Typography>
        <Typography data-testid={dataTestIds.taskStatus} variant="subtitle2">
          status: {task.taskStatus}
        </Typography>
      </Box>
    );
  }

  const hasWorkbinTask = tasks?.some(task => isWorkbinTaskInstance(task.taskInstance));
  const isTaskInTimeoutWarning = tasks?.some(task => taskDuration(task).as('minutes') > TASK_TIMEOUT_WARNING_MINUTES);

  return (
    <AccordionTaskList
      isLoading={isLoading}
      isTaskListDefaultExpanded={isTaskListDefaultExpanded}
      title={
        <Box display="flex" alignContent="center">
          <Typography>Currently Executing Steps</Typography>
          <Box padding="0.25rem" />
          {isTaskInTimeoutWarning && (
            <Tooltip arrow title={<Typography>A task is taking too much time.</Typography>}>
              <AccessTime data-testid={dataTestIds.longRunningTaskIcon} fontSize="small" color="error" />
            </Tooltip>
          )}
          {hasWorkbinTask && (
            <Tooltip arrow title={<Typography>A workbin task is waiting to be completed.</Typography>}>
              <Person data-testid={dataTestIds.workbinTaskIcon} fontSize="small" />
            </Tooltip>
          )}
        </Box>
      }
      taskIcon={<Spa fontSize="small" />}
      tasks={tasks}
      renderTaskListItem={renderTaskListItem}
    />
  );
};
