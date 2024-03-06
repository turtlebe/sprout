import {
  PlanStatus,
  SummaryStatus,
  TaskStatus,
  WorkcenterPlan,
  WorkcenterPlanResponse,
  WorkcenterTaskDetailsResponse,
} from '../../common/types';
import { getDateFormat } from '../../common/utils';

const today = new Date();
const todayDate = getDateFormat(today);

const planId = '02ff1dc7-ade1-48be-94e0-521d85f36539';
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/PropLoad';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: 'b3070b29-67a7-4800-bad1-8de09d0247a4',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:YW97-3K02-0U',
        germ_stack_path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack7',
        prop_level_path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
      }),
      workcenter,
      planId,
      title: 'Move table of B11 from Germ Stack 2 to Prop Level 4',
    },
    executionDetails: {
      taskStatus: TaskStatus.FAILED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.FAILURE,
          description: 'Move failed',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'b3070b29-67a7-4800-bad1-8de09d0247a4',
        type: 'mock',
        displayTitle: 'Move table of B11 from Germ Stack 2 to Prop Level 4',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
    },
  },
];
const plan: WorkcenterPlan = {
  id: 'a9f9f17c-85a5-4ccd-8afb-a0ed730f6380',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.FAILED,
  progress: 50,
  summary: [
    {
      status: SummaryStatus.FAILURE,
      description: 'Table of B11 failed to move',
    },
  ],
};
export const mockPropLoadFailedPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
