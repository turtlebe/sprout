import { UploadBulkCreateTasks, WorkcenterTasksImport } from '../types';

export const mockWorkcenterTasksImportPropLoad: WorkcenterTasksImport = {
  plannedDate: '2042-07-22',
  workcenter: 'PropLoad',
  task: 'LoadTableIntoPropFromGerm',
  tasks: [
    {
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:YW97-3K02-0U',
        germ_stack_path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack2',
        prop_level_path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel4',
      }),
      workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      title: 'Move table of B11 from Germ Stack 2 to Prop Level 4',
    },
    {
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:YW97-3K02-0U',
        germ_stack_path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack6',
        prop_level_path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
      }),
      workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      title: 'Move table of WHC from Germ Stack 6 to Prop Level 2',
    },
  ],
};

export const mockWorkcenterTasksImportSeed: WorkcenterTasksImport = {
  plannedDate: '2042-07-22',
  workcenter: 'Seed',
  task: 'SeedTraysAndLoadTableToGerm',
  tasks: [
    {
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:5WNV-JSM6-KB',
        germ_stack_path: { value: 'sites/LAX1' },
        seed_trays_and_load_to_table_prescription: { entry1: { crop: 'WHC', number_of_trays: 1 } },
      }),
      workcenter: 'sites/LAX1/farms/LAX1/workCenters/Seed',
      title: 'Seed 50 Trays of WHC',
    },
  ],
};

export const mockWorkcenterTasksImports: WorkcenterTasksImport[] = [
  mockWorkcenterTasksImportPropLoad,
  mockWorkcenterTasksImportSeed,
];

export const mockUploadBulkCreateTasks: UploadBulkCreateTasks = {
  PropLoad: {
    '2042-07-22 00:00:00': [
      {
        plannedDate: '2042-07-22',
        taskParametersJsonPayload: '{"table_serial": 7.0, "prop_level_path": "prop_level"}',
        taskPath:
          'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
      {
        plannedDate: '2042-07-22',
        taskParametersJsonPayload: '{"table_serial": 8.0, "prop_level_path": "prop_level"}',
        taskPath:
          'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
      {
        plannedDate: '2042-07-22',
        taskParametersJsonPayload:
          '{"table_serial": 7.0, "germ_stack_path": "gern_stack", "prop_level_path": "prop_level"}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
      {
        plannedDate: '2042-07-22',
        taskParametersJsonPayload:
          '{"table_serial": 8.0, "germ_stack_path": "germ_stack_2", "prop_level_path": "prop_level"}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
    ],
    '2042-07-23 00:00:00': [
      {
        plannedDate: '2042-07-23',
        taskParametersJsonPayload: '{"table_serial": 8.0, "prop_level_path": "prop_level"}',
        taskPath:
          'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
      {
        plannedDate: '2042-07-23',
        taskParametersJsonPayload: '{"table_serial": 8.0, "prop_level_path": "prop_level"}',
        taskPath:
          'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
      {
        plannedDate: '2042-07-23',
        taskParametersJsonPayload:
          '{"table_serial": 9.0, "germ_stack_path": "gern_stack", "prop_level_path": "prop_level"}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
      {
        plannedDate: '2042-07-23',
        taskParametersJsonPayload:
          '{"table_serial": 10.0, "germ_stack_path": "germ_stack_2", "prop_level_path": "prop_level"}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
      },
    ],
  },
  Seed: {
    '2042-07-21 00:00:00': [
      {
        plannedDate: '2042-07-21',
        taskParametersJsonPayload:
          '{"germ_stack_path": {"value": "pallete3"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"num_trays_entry_1": 3.0, "crop": {"value": "crop3"}}, "entry2": {"num_trays_entry_2": 32.0, "crop": {"value": "crop32"}}, "entry3": {"num_trays_entry_3": NaN, "crop": {"value": NaN}}, "entry4": {"num_trays_entry_4": NaN, "crop": {"value": NaN}}, "entry5": {"num_trays_entry_5": NaN, "crop": {"value": NaN}}}}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/Seed',
      },
      {
        plannedDate: '2042-07-21',
        taskParametersJsonPayload:
          '{"germ_stack_path": {"value": "pallete3"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"num_trays_entry_1": 3.0, "crop": {"value": "crop3"}}, "entry2": {"num_trays_entry_2": 32.0, "crop": {"value": "crop32"}}, "entry3": {"num_trays_entry_3": NaN, "crop": {"value": NaN}}, "entry4": {"num_trays_entry_4": NaN, "crop": {"value": NaN}}, "entry5": {"num_trays_entry_5": NaN, "crop": {"value": NaN}}}}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/Seed',
      },
    ],
    '2042-07-22 00:00:00': [
      {
        plannedDate: '2042-07-22',
        taskParametersJsonPayload:
          '{"germ_stack_path": {"value": "pallete5"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"num_trays_entry_1": 3.0, "crop": {"value": "crop3"}}, "entry2": {"num_trays_entry_2": 200.0, "crop": {"value": "crop32"}}, "entry3": {"num_trays_entry_3": NaN, "crop": {"value": NaN}}, "entry4": {"num_trays_entry_4": NaN, "crop": {"value": NaN}}, "entry5": {"num_trays_entry_5": NaN, "crop": {"value": NaN}}}}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/Seed',
      },
      {
        plannedDate: '2042-07-22',
        taskParametersJsonPayload:
          '{"germ_stack_path": {"value": "pallete5"}, "seed_trays_and_load_to_table_prescription": {"entry1": {"num_trays_entry_1": 3.0, "crop": {"value": "crop3"}}, "entry2": {"num_trays_entry_2": 200.0, "crop": {"value": "crop32"}}, "entry3": {"num_trays_entry_3": NaN, "crop": {"value": NaN}}, "entry4": {"num_trays_entry_4": NaN, "crop": {"value": NaN}}, "entry5": {"num_trays_entry_5": NaN, "crop": {"value": NaN}}}}',
        taskPath: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
        workcenter: 'sites/LAX1/farms/LAX1/workCenters/Seed',
      },
    ],
  },
  upload_id: 'plenty-workcenter-uploads:210c090a-66ef-4a4a-937d-2d93ccdafec7',
};
