import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { CollapsableTimelineTasks, TaskIcon, TimelineTask } from '..';
import { Subtasks, SummaryView } from '../../../common/components';
import { WorkcenterTaskDetailsResponse } from '../../../common/types';
import { getReactorsAndTasksDetailPath } from '../../../common/utils';
import { isTaskCompleted } from '../../utils';
import { TaskTitle } from '../task-title';

const dataTestIds = {
  reactorsAndTasksLink: 'completed-tasks-reactors-and-tasks-link',
};

export { dataTestIds as dataTestIdsCompletedTasks };

export interface CompletedTasks {
  tasks: WorkcenterTaskDetailsResponse[];
}

export const CompletedTasks: React.FC<CompletedTasks> = React.memo(({ tasks }) => {
  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  const completedTasks = tasks
    ? tasks
        .filter(task => isTaskCompleted(task))
        .map(
          (task, index, completedTasks) =>
            isTaskCompleted(task) && (
              <TimelineTask
                key={task.taskDetails.id}
                showConnector
                taskIcon={<TaskIcon taskStatus={task.executionDetails?.taskStatus} />}
              >
                <Box
                  borderRadius={'10px'}
                  bgcolor={'rgba(0,0,128,0.1)'} // navy
                  p={1}
                  marginBottom={index === completedTasks.length - 1 ? 5 : 0}
                >
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <TaskTitle task={task} />
                    <Box m={0.5} />
                    <PlentyLink
                      data-testid={dataTestIds.reactorsAndTasksLink}
                      to={getReactorsAndTasksDetailPath({
                        reactorsAndTasksDetailBasePath,
                        reactorPath: task.executionDetails.executingReactorPath,
                        taskId: task.executionDetails.taskInstance.id,
                      })}
                    >
                      details
                    </PlentyLink>
                  </Box>
                  <Box m={1} />
                  <SummaryView summary={task.executionDetails.summary} />
                  <Subtasks subTaskIds={task.executionDetails.subtaskIds} />
                </Box>
              </TimelineTask>
            )
        )
    : [];

  return (
    <CollapsableTimelineTasks title={`Completed (${completedTasks.length})`} defaultTimelineIconColor="navy">
      {completedTasks}
    </CollapsableTimelineTasks>
  );
});
