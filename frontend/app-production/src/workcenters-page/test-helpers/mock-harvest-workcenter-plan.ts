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
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Harvest';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/UnloadTowersFromVerticalGrowAndHarvest',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 10,
        crop: { value: 'WHC' },
        grow_lane: { value: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine1' },
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
          description: '10 towers of WHC unloaded',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: '10 towers of WHC unloaded',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Harvest',
    },
  },
  {
    taskDetails: {
      id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/UnloadTowersFromVerticalGrowAndHarvest',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 5,
        crop: { value: 'BAC' },
        grow_lane: { value: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine2' },
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
          description: '1/5 towers of BAC unloaded',
        },
      ],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
        type: 'mock',
        displayTitle: '1 tower of BAC unloaded',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Harvest',
    },
  },
  {
    taskDetails: {
      id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/UnloadTowersFromVerticalGrowAndHarvest',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 8,
        crop: { value: 'BAC' },
        grow_lane: { value: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine3' },
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
          description: '2/8 tower of BAC unloaded',
        },
      ],
      subtaskIds: ['id1'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
        type: 'mock',
        displayTitle: '0 tower of BAC unloaded',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Harvest',
    },
  },
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/UnloadTowersFromVerticalGrowAndHarvest',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 15,
        crop: { value: 'WHC' },
        grow_lane: { value: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine2' },
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
        displayTitle: '0 towers of WHc unloaded',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Harvest',
    },
  },
  {
    taskDetails: {
      id: '4a31b2bf-9f89-4f08-9c42-622f5a97a41c',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/UnloadTowersFromVerticalGrowAndHarvest',
      taskParametersJsonPayload: JSON.stringify({
        tower_count: 5,
        crop: { value: 'B10' },
        grow_lane: { value: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine3' },
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
        displayTitle: '0 towers of WHc unloaded',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Harvest',
    },
  },
];
const plan: WorkcenterPlan = {
  id: 'db353d3f-4846-481e-b2db-1e7269e97a71',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.RUNNING,
  progress: 75,
  summary: [
    {
      status: SummaryStatus.RUNNING,
      description: 'Unload 25 towers of WHC',
    },
    {
      status: SummaryStatus.RUNNING,
      description: 'Unload 13 towers of B20',
    },
    {
      status: SummaryStatus.RUNNING,
      description: 'Unload 5 towers of B10',
    },
  ],
};
export const mockHarvestWorkcenterPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
