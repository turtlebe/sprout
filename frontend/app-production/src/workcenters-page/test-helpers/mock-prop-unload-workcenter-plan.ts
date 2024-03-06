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
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/PropUnload';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropUnload/interfaces/PropUnload/methods/PreparePropForProduction',
      taskParametersJsonPayload: JSON.stringify({
        priority_order_prop_rack_1: [
          {
            priority_order: 1,
            table_serial: 'P900-0008046A:RC9X-4R6D-CG',
          },
          {
            priority_order: 2,
            table_serial: 'P900-0008046A:JSN9-YI3A-7P',
          },
        ],
        priority_order_prop_rack_2: {
          priority_order: 3,
          table_serial: 'P900-0008046A:5TJ2-D1CW-EJ',
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
          description: 'Shuffled propagation',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropUnload',
    },
  },
  {
    taskDetails: {
      id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/PropUnload/interfaces/PropUnload/methods/UnloadTableFromPropAndSendToTransplanter',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:CWS6-7POV-3H',
        prop_level_path: { value: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1' },
        rotate_table_from_level_path: {
          value: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
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
          description: 'Unloading table from propagation',
        },
      ],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'e9e9be8c-ebe0-474b-8350-9a3bec6478d1',
        type: 'mock',
        displayTitle: '???',
        taskParams: {
          tableSerial: 'P900-0008046A:CWS6-7POV-3H',
          propLevelPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
          rotateTableFromLevelPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
        },
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropUnload',
    },
  },
  {
    taskDetails: {
      id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/PropUnload/interfaces/PropUnload/methods/UnloadTableFromPropAndSendToTransplanter',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:RC9X-4R6D-CG',
        prop_level_path: { value: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2' },
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
          description: 'Unloading table from propagation',
        },
      ],
      subtaskIds: ['id1'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '0bfbbf88-c19d-496e-a51a-5f3317d4b631',
        type: 'mock',
        displayTitle: '???',
        taskParams: {
          tableSerial: 'P900-0008046A:RC9X-4R6D-CG',
          propLevelPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
        },
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropUnload',
    },
  },
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/PropUnload/interfaces/PropUnload/methods/UnloadTableFromPropAndSendToTransplanter',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:JSN9-YI3A-7P',
        prop_level_path: { value: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1' },
        rotate_table_from_level_path: {
          value: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3',
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
        taskParams: {
          tableSerial: 'P900-0008046A:JSN9-YI3A-7P',
          propLevelPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
          rotateTableFromLevelPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3',
        },
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropUnload',
    },
  },
  {
    taskDetails: {
      id: '4a31b2bf-9f89-4f08-9c42-622f5a97a41c',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/PropUnload/interfaces/PropUnload/methods/UnloadTableFromPropAndSendToTransplanter',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:5TJ2-D1CW-EJ',
        prop_level_path: { value: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1' },
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
        taskParams: {
          tableSerial: 'P900-0008046A:5TJ2-D1CW-EJ',
          propLevelPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
        },
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropUnload',
    },
  },
];
const plan: WorkcenterPlan = {
  id: 'db353d3f-4846-481e-b2db-1e7269e97a71',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.RUNNING,
  progress: 50,
  summary: [
    {
      status: SummaryStatus.RUNNING,
      description: 'Unloaded 0/4 tables from propgation',
    },
  ],
};
export const mockPropUnloadWorkcenterPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
