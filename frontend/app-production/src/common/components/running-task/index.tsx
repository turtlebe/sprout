import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { PlentyLink, Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { LeafTasks, Subtasks, SummaryView } from '..';
import { DurativeTaskState } from '../../types';

const dataTestIds = {
  title: 'running-task-string-title',
  reactorsAndTasksLink: 'running-task-reactors-and-tasks-link',
};

export { dataTestIds as dataTestIdsRunningTask };

export interface RunningTask {
  task: DurativeTaskState;
  title: string | JSX.Element;
  showSubTasks?: boolean;
  showDetailsLink?: boolean;
  isTaskListDefaultExpanded?: boolean;
}

/**
 * For given task, this component displays it's subtasks and leafTasks.
 * In addition, the title and a summary status is displayed.
 */
export const RunningTask: React.FC<RunningTask> = ({
  task,
  title,
  showSubTasks,
  showDetailsLink = false,
  isTaskListDefaultExpanded,
}) => {
  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  return (
    <Box
      borderRadius={'10px'}
      bgcolor={'rgba(0,128,0,0.1)'} // green
      p={1}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <Show when={typeof title === 'string'} fallback={<>{title}</>}>
          <Typography data-testid={dataTestIds.title} variant="subtitle1">
            {title}
          </Typography>
        </Show>
        <Show when={showDetailsLink}>
          <Box m={0.5} />
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
        </Show>
      </Box>
      <Box m={1} />
      <SummaryView summary={task?.summary} />
      <Box m={2} />
      <Box>
        <Show when={showSubTasks}>
          <Subtasks isTaskListDefaultExpanded={isTaskListDefaultExpanded} subTaskIds={task?.subtaskIds} />
        </Show>
        <LeafTasks isTaskListDefaultExpanded={isTaskListDefaultExpanded} taskId={task?.taskInstance.id} />
      </Box>
    </Box>
  );
};
