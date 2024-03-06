import { ChevronRight, NewReleases } from '@material-ui/icons';
import { CardItem } from '@plentyag/brand-ui/src/components/card-item';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { orderBy } from 'lodash';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';

import { WorkbinTaskDefinition, WorkbinTaskInstance } from '../../../common/types';
import { WorkbinActionForm } from '../workbin-action-form';

import { useStyles } from './styles';

const dataTestIds = {
  noData: 'card-item-tasks-no-data',
  taskInstance: 'card-item-tasks-task-instance',
  taskInstanceTitle: 'card-item-tasks-task-instance-title',
};

export { dataTestIds as dataTestIdsCardItemsTasks };

interface Task {
  workbinTaskDefinition: WorkbinTaskDefinition;
  workbinTaskInstance?: WorkbinTaskInstance;
}

export interface CardItemTasks {
  cardTitle: string;
  tasks: Task[];
  workbin: string;
  showCreatedAt?: boolean;
  onTaskCompleted?: () => void;
}

/**
 * Displays a list of tasks in a CardItem view. Each task includes it's workbin defn and an instance (if one exists).
 * Users can click a task item which will open a form allowing user to complete or skip.
 * @param cardTitle The title to be displayed in the card item.
 * @param tasks The task list of tasks to be displayed.
 * @param workbin The workbin name.
 * @param onTaskCompleted Callback that is invoked when the task is successfully submitted.
 */
export const CardItemTasks: React.FC<CardItemTasks> = ({
  cardTitle,
  tasks,
  workbin,
  showCreatedAt = false,
  onTaskCompleted,
}) => {
  const classes = useStyles();

  const [selectedWorkbinTask, setSelectedWorkbinTask] = React.useState<Task>();

  // Sort tasked based on createdAt time
  const sortedTaskItems = useMemo(() => orderBy(tasks, 'workbinTaskInstance.createdAt', 'desc'), [tasks]);

  const taskItems = sortedTaskItems?.map((task, index) => {
    const taskDefn = task.workbinTaskDefinition;
    const taskInstance = task.workbinTaskInstance;
    return (
      <Box className={classes.container} key={index}>
        <Button
          data-testid={dataTestIds.taskInstance}
          className={classes.taskButton}
          size="small"
          onClick={() => setSelectedWorkbinTask(task)}
          startIcon={taskDefn.priority === 'URGENT' ? <NewReleases /> : <ChevronRight />}
        >
          <span className={classes.taskTitle} data-testid={dataTestIds.taskInstanceTitle}>
            {taskDefn.title}
          </span>
          <Show when={showCreatedAt && Boolean(taskInstance?.createdAt)}>
            <span className={classes.taskDate}>
              {DateTime.fromISO(taskInstance?.createdAt).toFormat(DateTimeFormat.US_DEFAULT)}
            </span>
          </Show>
        </Button>
      </Box>
    );
  });

  function handleClose(hasSubmittedSuccessfully: boolean) {
    setSelectedWorkbinTask(undefined);
    hasSubmittedSuccessfully && onTaskCompleted && onTaskCompleted();
  }

  const cardTitleWithCount = `${cardTitle}${taskItems?.length > 0 ? ` (${taskItems.length})` : ''}`;

  return (
    <Box mb={3}>
      <CardItem name={cardTitleWithCount}>
        <Box>{taskItems?.length > 0 ? taskItems : <Typography data-testid={dataTestIds.noData}>None</Typography>}</Box>
      </CardItem>
      <WorkbinActionForm
        workbinTaskDefinition={selectedWorkbinTask?.workbinTaskDefinition}
        workbinTaskInstance={selectedWorkbinTask?.workbinTaskInstance}
        workbin={workbin}
        onClose={handleClose}
      />
    </Box>
  );
};
