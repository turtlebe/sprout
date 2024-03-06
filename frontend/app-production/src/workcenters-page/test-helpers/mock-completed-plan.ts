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
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Pack';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Pack/interfaces/Pack/methods/BlendCrop',
      taskParametersJsonPayload: JSON.stringify({
        blend_crop_name: 'C11',
      }),
      workcenter,
      planId,
      title: 'Pack 30 cases of WHC',
    },
    executionDetails: {
      taskStatus: TaskStatus.COMPLETED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.SUCCESS,
          description: 'Packed 30/30 cases',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: 'Pack 30 cases of B11',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Pack',
    },
  },
  {
    taskDetails: {
      id: 'b3070b29-67a7-4800-bad1-8de09d0247a4',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Pack/interfaces/Pack/methods/BlendCrop',
      taskParametersJsonPayload: JSON.stringify({
        blend_crop_name: 'C11',
      }),
      workcenter,
      planId,
      title: 'Pack 10 cases of B11',
    },
    executionDetails: {
      taskStatus: TaskStatus.COMPLETED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.SUCCESS,
          description: 'Packed 10/10 cases',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'b3070b29-67a7-4800-bad1-8de09d0247a4',
        type: 'mock',
        displayTitle: 'Pack 10 cases of B11',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Pack',
    },
  },
];
const plan: WorkcenterPlan = {
  id: '356ba7d8-d586-4aa8-8dad-f37e90c7bd4f',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.COMPLETED,
  progress: 100,
  summary: [
    {
      status: SummaryStatus.SUCCESS,
      description: 'Packed 30/30 cases',
    },
    {
      status: SummaryStatus.SUCCESS,
      description: 'Packed 10/10 cases',
    },
  ],
};
export const mockPropLoadCompletedPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
