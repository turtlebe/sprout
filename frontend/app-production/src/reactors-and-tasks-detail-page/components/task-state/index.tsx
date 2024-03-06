import { Box, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { dataTestIdsTaskOrReactorStateJsonView, TaskOrReactorStateJsonView } from '..';
import { DurativeTaskState } from '../../../common/types';
import { useGetState } from '../../hooks';
import { ReactorPath } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  noState: 'task-state-no-state',
  jsonView: dataTestIdsTaskOrReactorStateJsonView.jsonView,
};

export { dataTestIds as dataTestIdsTaskState };

export interface TaskState {
  taskId?: string;
  reactorPath?: ReactorPath;
}

export const TaskState: React.FC<TaskState> = ({ taskId, reactorPath }) => {
  const {
    data: taskState,
    isLoading,
    error,
  } = useGetState<DurativeTaskState>({
    axiosRequestConfig: taskId && {
      url: '/api/plentyservice/executive-service/get-durative-task-by-id',
      params: {
        task_id: taskId,
      },
    },
    errorTitle: 'Error loading task state',
  });

  const classes = useStyles({ isLoading });

  return (
    <Box className={classes.container}>
      <LinearProgress className={classes.linearProgress} />
      <Typography gutterBottom>Task Details for ID: {taskId}</Typography>
      <TaskOrReactorStateJsonView state={taskState} reactorPath={reactorPath} />
      {!taskState && !isLoading && !error && (
        <Typography data-testid={dataTestIds.noState}>No state for given task ID</Typography>
      )}
    </Box>
  );
};
