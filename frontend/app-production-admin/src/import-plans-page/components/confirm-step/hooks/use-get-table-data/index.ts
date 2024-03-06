import {
  TaskDetails,
  UploadBulkCreateTasks,
  WorkcenterTasksImport,
} from '@plentyag/app-production-admin/src/import-plans-page/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { orderBy } from 'lodash';

export const UPLOAD_ID_KEY = 'upload_id';

export const useGetTableData = (uploadBulkCreateTasks?: UploadBulkCreateTasks): WorkcenterTasksImport[] => {
  if (!uploadBulkCreateTasks) {
    return [];
  }

  // go through all the task dates grouped by workcenter
  const workcenterTasksImport = Object.keys(uploadBulkCreateTasks).reduce((acc, workcenter) => {
    if (workcenter === UPLOAD_ID_KEY) {
      return acc;
    }

    const tasksByDates = uploadBulkCreateTasks[workcenter];

    // go through all the tasks grouped by dates
    Object.keys(tasksByDates).forEach(plannedDate => {
      const tasksOfThisDate = tasksByDates[plannedDate];

      // go through all the tasks of this date
      Object.values(tasksOfThisDate).forEach((taskDetails: TaskDetails) => {
        const task = getKindFromPath(taskDetails.taskPath, 'methods');

        // if existing date/workcenter/task object, mutate
        const existingWorkcenterTaskImport = acc.find(
          item => item.task === task && item.workcenter === workcenter && item.plannedDate === plannedDate
        );

        if (existingWorkcenterTaskImport) {
          existingWorkcenterTaskImport.tasks.push(taskDetails);
          return;
        }

        // otherwise add a new date/workcenter/task object
        acc.push({
          plannedDate,
          workcenter,
          task,
          tasks: [taskDetails],
        });
      });
    });

    return acc;
  }, []);

  // Order the list by Date the Workcenter then Task
  const sortedWorkcenterTasksImport = orderBy(workcenterTasksImport, ['plannedDate', 'workcenter', 'task']);

  return sortedWorkcenterTasksImport;
};
