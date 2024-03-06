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
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Seed';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 30 Trays of WHC',
    },
    executionDetails: {
      taskStatus: TaskStatus.COMPLETED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.SUCCESS,
          description: '30/30 Trays of WHC seeded',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: 'Seed 50 Trays of WHC',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 50 Trays of WHC',
    },
    executionDetails: {
      taskStatus: TaskStatus.RUNNING,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.RUNNING,
          description: '10/50 Trays of WHC seeded',
        },
      ],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
        type: 'mock',
        displayTitle: 'Seed 50 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 30 Trays of B20',
    },
    executionDetails: {
      taskStatus: TaskStatus.RUNNING,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.RUNNING,
          description: '1/30 Trays of B20 seeded',
        },
      ],
      subtaskIds: ['id1'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
        type: 'mock',
        displayTitle: 'Seed 30 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 30 Trays of B20',
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
        displayTitle: 'Seed 30 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '4a31b2bf-9f89-4f08-9c42-622f5a97a41c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 60 Trays of B20',
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
        displayTitle: 'Seed 60 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
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
      description: 'Seeded 40/80 Trays of WHC',
    },
    {
      status: SummaryStatus.RUNNING,
      description: 'Seeded 1/120 Trays of B20',
    },
  ],
};
export const mockSeedInProgressPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
