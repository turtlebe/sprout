import { Card } from '@plentyag/brand-ui/src/components/card';
import { Divider } from '@plentyag/brand-ui/src/material-ui/core';
import { usePageVisibility } from '@plentyag/core/src/hooks';
import React from 'react';
import { useInterval } from 'react-use';

import { UnifiedWorkbinInstanceData, WorkbinPriority, WorkbinTaskInstanceFilter } from '../../../common/types';
import { useLoadWorkbinInstances } from '../../hooks';
import { CardItemTasks } from '../card-item-tasks';
import { getFilteredWorkbinTaskDefinition, getFilteredWorkbinTaskInstance } from '../utils';

const dataTestIds = {};

export { dataTestIds as dataTestIdsCurrentTasks };

export interface CurrentTasks {
  workspace: string;
  farmPath: string;
  searchText: string;
  searchResultCount: (count: number) => void;
  onTaskCompleted?: () => void;
}

export const CurrentTasks: React.FC<CurrentTasks> = ({
  workspace,
  farmPath,
  searchText,
  searchResultCount,
  onTaskCompleted,
}) => {
  const { isLoading, unifiedWorkbinInstanceData, loadData } = useLoadWorkbinInstances();

  const visibilityState = usePageVisibility();

  const filter: WorkbinTaskInstanceFilter = {
    farm: farmPath,
    workbin: workspace,
    statuses: ['NOT_STARTED'],
  };

  useInterval(
    () => {
      if (workspace && farmPath && !isLoading && visibilityState === 'visible') {
        loadData(filter);
      }
    },
    visibilityState === 'visible' ? 15000 : null
  );

  React.useEffect(() => {
    if (visibilityState === 'visible' && workspace && farmPath) {
      loadData(filter);
    }
  }, [workspace, farmPath, visibilityState]);

  function getTasksWithPriority(tasks: UnifiedWorkbinInstanceData[], priority: WorkbinPriority, searchText: string) {
    return tasks
      ?.filter(taskInstance => taskInstance.workbinTaskDefinition.priority === priority)
      ?.filter(
        taskInstance =>
          getFilteredWorkbinTaskDefinition(taskInstance.workbinTaskDefinition, searchText) ||
          getFilteredWorkbinTaskInstance(taskInstance.workbinTaskInstance, searchText, true)
      )
      .map(task => ({
        workbinTaskDefinition: task.workbinTaskDefinition,
        workbinTaskInstance: task.workbinTaskInstance,
      }));
  }

  const urgentTasks = getTasksWithPriority(unifiedWorkbinInstanceData, 'URGENT', searchText);
  const regularTasks = getTasksWithPriority(unifiedWorkbinInstanceData, 'REGULAR', searchText);
  const shiftTasks = getTasksWithPriority(unifiedWorkbinInstanceData, 'SHIFT', searchText);

  React.useEffect(() => {
    searchResultCount(unifiedWorkbinInstanceData ? urgentTasks.length + regularTasks.length + shiftTasks.length : 0);
  }, [unifiedWorkbinInstanceData, urgentTasks, regularTasks, shiftTasks]);

  function handleTaskCompleted() {
    onTaskCompleted && onTaskCompleted();
    loadData(filter);
  }

  return (
    <Card raised isLoading={isLoading} title="Today's Workbin Tasks" titleVariant="h6">
      <CardItemTasks
        cardTitle="Urgent"
        tasks={urgentTasks}
        workbin={workspace}
        onTaskCompleted={handleTaskCompleted}
        showCreatedAt
      />
      <Divider variant="middle" />
      <CardItemTasks
        cardTitle="Regular"
        tasks={regularTasks}
        workbin={workspace}
        showCreatedAt
        onTaskCompleted={handleTaskCompleted}
      />
      <Divider variant="middle" />
      <CardItemTasks
        cardTitle="Shift"
        tasks={shiftTasks}
        workbin={workspace}
        showCreatedAt
        onTaskCompleted={handleTaskCompleted}
      />
    </Card>
  );
};
