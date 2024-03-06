import { Card } from '@plentyag/brand-ui/src/components/card';
import React from 'react';

import { useLoadWorkbinTaskDefinitions } from '../../../common/hooks';
import { CardItemTasks } from '../card-item-tasks';
import { getFilteredWorkbinTaskDefinition } from '../utils';

export interface CommonTasksAndActions {
  workspace: string;
  farmPath: string;
  searchText: string;
  searchResultCount: (count: number) => void;
  onTaskCompleted?: () => void;
}

/**
 * Displays a list of "unscheduled tasks" - these are tasks that are not scheduled automatically
 * by FarmOS but they are tasks the user might need to perform. So the user can choose from the
 * list and execute as needed.
 * @param workspace The workspace to show "unscheduled tasks".
 * @param farmpath The farm to show "unscheduled tasks".
 * @param searchText The search text to show filtered "unscheduled tasks".
 */
export const CommonTasksAndActions: React.FC<CommonTasksAndActions> = ({
  workspace,
  farmPath,
  searchText,
  searchResultCount,
  onTaskCompleted,
}) => {
  const { loadData, workbinTaskDefinitions, isLoading } = useLoadWorkbinTaskDefinitions();

  React.useEffect(() => {
    if (workspace && farmPath) {
      loadData({
        workbin: workspace,
        farm: farmPath,
        definitionCreatedByInternalService: false,
      });
    }
  }, [workspace, farmPath]);

  const unscheduledTasks = workbinTaskDefinitions
    ?.filter(taskDefn => !taskDefn.scheduled)
    ?.filter(taskInstance => getFilteredWorkbinTaskDefinition(taskInstance, searchText))
    .map(defn => ({ workbinTaskDefinition: defn }));

  React.useEffect(() => {
    searchResultCount(unscheduledTasks ? unscheduledTasks.length : 0);
  }, [unscheduledTasks]);

  return (
    <Card raised isLoading={isLoading} title="Common Workbin Tasks & Actions" titleVariant="h6">
      <CardItemTasks
        cardTitle="Unscheduled Tasks"
        tasks={unscheduledTasks}
        workbin={workspace}
        onTaskCompleted={onTaskCompleted}
      />
    </Card>
  );
};
