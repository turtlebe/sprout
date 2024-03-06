import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { CollapsableTimelineTasks, TaskIcon, TimelineTask } from '..';
import { RunningTask } from '../../../common/components';
import { WorkcenterTaskDetailsResponse } from '../../../common/types';
import { isTaskRunning } from '../../utils';
import { TaskTitle } from '../task-title';

const dataTestIds = {};

export { dataTestIds as dataTestIdsRunningTasks };

export interface RunningTasks {
  tasks: WorkcenterTaskDetailsResponse[];
}

/**
 * This component displays a list of running tasks.
 */
export const RunningTasks: React.FC<RunningTasks> = React.memo(({ tasks }) => {
  const runningTasks = tasks
    ? tasks
        .filter(task => isTaskRunning(task))
        .map((task, index, runningTasks) => (
          <TimelineTask
            key={task.taskDetails.id}
            showConnector
            taskIcon={<TaskIcon taskStatus={task.executionDetails?.taskStatus} />}
          >
            <Box marginBottom={index === runningTasks.length - 1 ? 5 : 0}>
              <RunningTask title={<TaskTitle task={task} />} task={task.executionDetails} showDetailsLink />
            </Box>
          </TimelineTask>
        ))
    : [];

  return (
    <CollapsableTimelineTasks title={`Running (${runningTasks.length})`} defaultTimelineIconColor="green">
      {runningTasks}
    </CollapsableTimelineTasks>
  );
});
