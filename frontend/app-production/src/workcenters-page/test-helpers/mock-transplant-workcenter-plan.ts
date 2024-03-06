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
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Transplant';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Transplant/interfaces/Transplant/methods/TransplantTowersAndLoadToVerticalGrow',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 10,
        crop: 'WHC',
        grow_lane: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine1',
      }),
      workcenter,
      planId,
      title: undefined,
    },
    executionDetails: {
      taskStatus: TaskStatus.COMPLETED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.SUCCESS,
          description: 'Transplated 10 trays',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant',
    },
  },
  {
    taskDetails: {
      id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant/interfaces/Transplant/methods/LoadEmptiesToVerticalGrow',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 5,
        grow_lane: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine1',
      }),
      workcenter,
      planId,
      title: undefined,
    },
    executionDetails: {
      taskStatus: TaskStatus.RUNNING,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.RUNNING,
          description: 'Transplanted 1/5 empty towers',
        },
      ],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant',
    },
  },
  {
    taskDetails: {
      id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Transplant/interfaces/Transplant/methods/TransplantTowersAndLoadToVerticalGrow',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 5,
        crop: 'BAC',
        grow_lane: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine2',
      }),
      workcenter,
      planId,
      title: undefined,
    },
    executionDetails: {
      taskStatus: TaskStatus.RUNNING,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.RUNNING,
          description: 'Transplated 2/5 towers',
        },
      ],
      subtaskIds: ['id1'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant',
    },
  },
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Transplant/interfaces/Transplant/methods/TransplantTowersAndLoadToVerticalGrow',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 5,
        crop: 'BAC',
        grow_lane: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine2',
      }),
      workcenter,
      planId,
      title: undefined,
    },
    executionDetails: {
      taskStatus: TaskStatus.CREATED,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant',
    },
  },
  {
    taskDetails: {
      id: '4a31b2bf-9f89-4f08-9c42-622f5a97a41c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant/interfaces/Transplant/methods/LoadEmptiesToVerticalGrow',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 2,
        grow_lane: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine4',
      }),
      workcenter,
      planId,
      title: undefined,
    },
    executionDetails: {
      taskStatus: TaskStatus.CREATED,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '4a31b2bf-9f89-4f08-9c42-622f5a97a41c',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Transplant',
    },
  },
];
const plan: WorkcenterPlan = {
  id: 'db353d3f-4846-481e-b2db-1e7269e97a71',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.RUNNING,
  progress: 17,
  summary: [
    {
      status: SummaryStatus.RUNNING,
      description: 'Loading 10 WHC towers to vertical grow',
    },
    {
      status: SummaryStatus.RUNNING,
      description: 'Loading 10 BAC towers to vertical grow',
    },
  ],
};
export const mockTransplantWorkcenterPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
