import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getLevelFromTaskStatus, getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { DialogConfirmation, PlentyLink, Show, StatusLabel } from '@plentyag/brand-ui/src/components';
import { Box, Button, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { RunningTask } from '../../../common/components';
import { DurativeTaskState, TaskStatus } from '../../../common/types';
import { useCancelTask, useGetState } from '../../hooks';

import { useStyles } from './styles';

const dataTestIds = {
  noState: 'task-progress-no-state',
  cancelButton: 'task-progress-cancel-button',
  taskParent: 'task-progress-task-parent',
};

export { dataTestIds as dataTestIdsTaskProgress };

export interface TaskProgress {
  taskId: string;
  isTaskListDefaultExpanded?: boolean;
  reactorPath?: string;
}

/**
 * For the given task id this component displays the task title, summary, running sub-tasks and
 * currently executing tasks (aka, leaf tasks).
 */
export const TaskProgress: React.FC<TaskProgress> = ({ taskId, isTaskListDefaultExpanded, reactorPath }) => {
  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  const {
    data: taskState,
    isLoading,
    error,
    reload,
  } = useGetState<DurativeTaskState>({
    axiosRequestConfig: taskId && {
      url: '/api/plentyservice/executive-service/get-durative-task-by-id',
      params: {
        task_id: taskId,
      },
    },
    errorTitle: 'Error loading task state',
  });

  const [open, setOpen] = React.useState<boolean>(false);

  const { isCanceling, cancelTask } = useCancelTask({
    taskId,
    reactorPath,
    onSuccess: reload,
  });

  const classes = useStyles({ isLoading: isLoading || isCanceling });

  function handleCancelTask() {
    setOpen(false);
    cancelTask();
  }

  const taskStatus = taskState?.taskStatus;
  const title = `Title: ${taskState?.taskInstance?.displayTitle || '--'}`;
  const statusLevel = getLevelFromTaskStatus(taskStatus);
  const parentTaskId = taskState?.taskInstance?.parentTaskId;

  return (
    <Box className={classes.container}>
      <LinearProgress className={classes.linearProgress} />
      <Typography gutterBottom>Task Progress for ID: {taskId}</Typography>
      <Typography gutterBottom>
        Task Status: <StatusLabel text={taskStatus} level={statusLevel} />
      </Typography>
      <Typography gutterBottom>Task {title}</Typography>
      <Show when={Boolean(parentTaskId && reactorPath)}>
        <Typography data-testid={dataTestIds.taskParent}>
          Task Parent:{' '}
          <PlentyLink
            to={getReactorsAndTasksDetailPath({
              reactorsAndTasksDetailBasePath,
              reactorPath,
              taskId: parentTaskId,
            })}
          >
            {parentTaskId}
          </PlentyLink>
        </Typography>
      </Show>
      <Show when={Boolean(!taskState && !isLoading && !error)}>
        <Typography data-testid={dataTestIds.noState}>No state for given task ID</Typography>
      </Show>
      <Show
        when={
          (Boolean(taskStatus) && taskStatus === TaskStatus.RUNNING) ||
          taskStatus === TaskStatus.QUEUED ||
          taskStatus === TaskStatus.CANCELLING
        }
      >
        <RunningTask
          task={taskState}
          isTaskListDefaultExpanded={isTaskListDefaultExpanded}
          title={title}
          showSubTasks
        />
      </Show>
      <Show
        when={Boolean(
          reactorPath &&
            taskState &&
            taskStatus !== TaskStatus.COMPLETED &&
            taskStatus !== TaskStatus.CANCELED &&
            taskStatus !== TaskStatus.CANCELLING &&
            taskStatus !== TaskStatus.FAILED
        )}
      >
        <Box mt={1}>
          <Button
            data-testid={dataTestIds.cancelButton}
            disabled={isCanceling}
            fullWidth={false}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Cancel Task
          </Button>
          <DialogConfirmation
            open={open}
            title="Are you sure you'd like to cancel this task?"
            confirmLabel="Yes, cancel running task"
            cancelLabel="No, keep task running"
            onConfirm={handleCancelTask}
            onCancel={() => setOpen(false)}
          />
        </Box>
      </Show>
    </Box>
  );
};
