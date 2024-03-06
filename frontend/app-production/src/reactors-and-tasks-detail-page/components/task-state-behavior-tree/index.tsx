import React from 'react';

import { DurativeTaskState } from '../../../common/types';
import { useGetState } from '../../hooks';
import { ReactorBehaviorTree } from '../reactor-behavior-tree';

const dataTestIds = {};

export { dataTestIds as dataTestIdsTaskStateBehaviorTree };

export interface TaskStateBehaviorTree {
  taskId: string;
}

export const TaskStateBehaviorTree: React.FC<TaskStateBehaviorTree> = ({ taskId }) => {
  const {
    data: taskState,
    isLoading,
    reload,
  } = useGetState<DurativeTaskState>({
    axiosRequestConfig: taskId && {
      url: '/api/plentyservice/executive-service/get-durative-task-by-id',
      params: {
        task_id: taskId,
      },
    },
    errorTitle: 'Error loading task state',
    enablePeriodicRefresh: false,
  });

  return <ReactorBehaviorTree isLoading={isLoading} reload={reload} behaviorTree={taskState?.btExecutionTrace} />;
};
