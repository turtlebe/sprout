import {
  PlanStatus,
  TaskStatus,
  WorkcenterPlan,
  WorkcenterPlanResponse,
  WorkcenterTaskDetailsResponse,
} from '../../common/types';
import { getDateFormat } from '../../common/utils';

const today = new Date();
const todayDate = getDateFormat(today);

const planId = '73cd8823-b02e-47f2-b408-a134b946f278';
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Seed';
const mockCreatedTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '0cbe336f-00a1-43e7-964e-334fe99d3131',
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
        id: '0cbe336f-00a1-43e7-964e-334fe99d3131',
        type: 'mock',
        displayTitle: 'Seed 30 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  {
    taskDetails: {
      id: '5d0677af-30a3-4ad7-b63f-955a35a6cc07',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 50 Trays of WHC',
    },
    executionDetails: {
      taskStatus: TaskStatus.CREATED,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '5d0677af-30a3-4ad7-b63f-955a35a6cc07',
        type: 'mock',
        displayTitle: 'Seed 50 Trays of WHC',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
];
const plan: WorkcenterPlan = {
  id: 'cde4cb05-281a-49cc-94bb-dc7ca5362897',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockCreatedTasks.map(task => task.taskDetails.id),
  status: PlanStatus.CREATED,
  progress: 0,
  summary: [],
};
export const mockSeedCreatedPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockCreatedTasks,
};
