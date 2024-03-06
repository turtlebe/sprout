import { DoubleArrow } from '@material-ui/icons';
import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { PlentyLink, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { usePostRequest, useRunActionPeriodicallyWhenVisible } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';
import { useDeepCompareEffect } from 'react-use';

import { AccordionTaskList, SummaryView } from '..';
import { DurativeTaskState } from '../../../common/types';
import { WORKCENTER_REFRESH_PERIOD } from '../../../constants';

const dataTestIds = {
  taskListItem: 'sub-tasks-task-list-item',
};

export { dataTestIds as dataTestIdsSubtasks };

export interface Subtasks {
  subTaskIds: string[];
  isTaskListDefaultExpanded?: boolean;
}

export const Subtasks: React.FC<Subtasks> = ({ subTaskIds, isTaskListDefaultExpanded }) => {
  const [isExpanded, setIsExpanded] = React.useState(isTaskListDefaultExpanded);
  const [tasks, setTasks] = React.useState<DurativeTaskState[]>([]);
  const snackbar = useGlobalSnackbar();

  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  const { makeRequest, isLoading } = usePostRequest<DurativeTaskState[], any>({
    url: '/api/plentyservice/executive-service/get-durative-tasks-by-ids',
  });

  function doRequest() {
    if (subTaskIds?.length > 0) {
      makeRequest({
        data: subTaskIds,
        onSuccess: data => setTasks(data),
        onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
      });
    }
  }

  useDeepCompareEffect(() => {
    if (isExpanded && subTaskIds) {
      doRequest();
    }
  }, [isExpanded, subTaskIds]);

  useRunActionPeriodicallyWhenVisible({
    condition: () => !isLoading && isExpanded,
    action: doRequest,
    period: WORKCENTER_REFRESH_PERIOD,
  });

  function renderTaskListItem(task: DurativeTaskState) {
    const taskName = (
      <PlentyLink
        to={getReactorsAndTasksDetailPath({
          reactorsAndTasksDetailBasePath,
          reactorPath: task.executingReactorPath,
          taskId: task.taskInstance.id,
        })}
      >
        {task.taskInstance.displayTitle}
      </PlentyLink>
    );
    return (
      <Box data-testid={dataTestIds.taskListItem}>
        <Typography>{taskName}</Typography>
        <Typography variant="subtitle2">status: {task.taskStatus}</Typography>
        <SummaryView summary={task.summary} />
      </Box>
    );
  }

  return (
    <AccordionTaskList
      isLoading={isLoading}
      isTaskListDefaultExpanded={isTaskListDefaultExpanded}
      onAccordionChange={setIsExpanded}
      title={<Typography>Sub-Tasks</Typography>}
      taskIcon={<DoubleArrow fontSize="small" />}
      tasks={tasks}
      renderTaskListItem={renderTaskListItem}
    />
  );
};
