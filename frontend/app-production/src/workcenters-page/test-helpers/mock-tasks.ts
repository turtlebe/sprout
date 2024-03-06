import { SummaryStatus, TaskStatus, WorkcenterTaskDetailsResponse } from '../../common/types';

const planId = '02ff1dc7-ade1-48be-94e0-521d85f36539';
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Pack';

// set of mock tasks - one for each status type: completed, failed, canceled, running, queued, cancelling, created.
export const mockTasks: WorkcenterTaskDetailsResponse[] = [
  // completed task
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
  // failed
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
  // canceled
  {
    taskDetails: {
      id: 'ca231a70-c709-11ec-9d64-0242ac120002',
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
      taskStatus: TaskStatus.CANCELED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.CANCELED,
          description: 'Move canceled',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'ca231a70-c709-11ec-9d64-0242ac120002',
        type: 'mock',
        displayTitle: 'Move table of B11 from Germ Stack 2 to Prop Level 4',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
    },
  },
  // running
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
  // queued
  {
    taskDetails: {
      id: 'de183326-c709-11ec-9d64-0242ac120002',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 50 Trays of WHC',
    },
    executionDetails: {
      taskStatus: TaskStatus.QUEUED,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'de183326-c709-11ec-9d64-0242ac120002',
        type: 'mock',
        displayTitle: 'Seed 50 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  // cancelling
  {
    taskDetails: {
      id: 'fb2e5f76-c709-11ec-9d64-0242ac120002',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload:
        '{"table_serial": "P900-0008046A:5WNV-JSM6-KB", "germ_stack_path": {"value": "sites/LAX1"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"crop": "WHC", "number_of_trays": 1}}}',
      workcenter,
      planId,
      title: 'Seed 50 Trays of WHC',
    },
    executionDetails: {
      taskStatus: TaskStatus.CANCELLING,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: ['id1', 'id2'],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'fb2e5f76-c709-11ec-9d64-0242ac120002',
        type: 'mock',
        displayTitle: 'Seed 50 Trays of B20',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
    },
  },
  // created
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
