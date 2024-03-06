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
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:RC9X-4R6D-CG',
        germ_stack_path: { value: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack7' },
        seed_trays_and_load_to_table_prescription: {
          entry1: {
            number_of_trays: 5,
            crop: 'WHC',
          },
          entry2: {
            number_of_trays: 10,
            crop: 'C11',
          },
          entry3: {
            number_of_trays: null,
            crop: {},
          },
        },
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
          description: 'Seeded 15 trays',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:CWS6-7POV-3H',
        germ_stack_path: { value: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack1' },
        seed_trays_and_load_to_table_prescription: {
          entry1: {
            number_of_trays: 15,
            crop: 'WHC',
          },
          entry2: {
            number_of_trays: 10,
            crop: 'C11',
          },
          entry3: {
            number_of_trays: 20,
            crop: 'BAC',
          },
        },
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
          description: 'Seeded 15/45 trays',
        },
      ],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:RC9X-4R6D-CG',
        germ_stack_path: { value: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack1' },
        seed_trays_and_load_to_table_prescription: {
          entry1: {
            number_of_trays: 5,
            crop: 'WHC',
          },
        },
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
          description: 'Seeded 0/5 trays',
        },
      ],
      subtaskIds: ['id1'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:JSN9-YI3A-7P',
        germ_stack_path: { value: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack7' },
        seed_trays_and_load_to_table_prescription: {
          entry1: {
            number_of_trays: 5,
            crop: 'WHC',
          },
          entry2: {
            number_of_trays: 10,
            crop: 'C11',
          },
        },
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
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '4a31b2bf-9f89-4f08-9c42-622f5a97a41c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:5TJ2-D1CW-EJ',
        germ_stack_path: { value: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack2' },
        seed_trays_and_load_to_table_prescription: {
          entry1: {
            number_of_trays: 5,
            crop: 'WHC',
          },
          entry2: {
            number_of_trays: 5,
            crop: 'BAC',
          },
        },
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
  progress: 17,
  summary: [
    {
      status: SummaryStatus.RUNNING,
      description: 'Seeded 15/90 tables to propagation',
    },
  ],
};
export const mockSeedWorkcenterPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
