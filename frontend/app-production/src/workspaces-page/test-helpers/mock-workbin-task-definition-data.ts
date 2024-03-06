import { WorkbinTaskDefinition } from '../../common/types';

export const mockWorkbinTaskDefinitionData: WorkbinTaskDefinition[] = [
  {
    createdAt: '2021-08-03T18:53:01.240547Z',
    description: 'WorkbinDef_ShiftPri_TestDescription',
    farm: 'sites/SSF2/farms/Tigris',
    fields: [
      {
        name: 'TestFieldName',
        type: 'TYPE_STRING',
      },
    ],
    groups: [],
    id: '0bf59f51-0a2c-467e-98d4-7753556279b5',
    priority: 'SHIFT',
    sopLink: 'TestSOP',
    title: 'TestTitle',
    shortTitle: 'Test Short Title',
    updatedAt: '2021-08-03T18:53:01.240547Z',
    workbins: ['Grower', 'PostHarvestOperator'],
    scheduled: true,
    definitionCreatedByInternalService: false,
  },
  {
    createdAt: '2021-08-03T20:54:18.479060Z',
    description: 'WorkbinDef_UrgentPri_TestDescription',
    farm: 'sites/SSF2/farms/Tigris',
    fields: [],
    groups: [],
    id: 'c1cdf49b-2f66-4e4c-a284-d0752eaca023',
    priority: 'URGENT',
    sopLink: 'TestSOP',
    title: 'TestTitle: Urgent',
    shortTitle: 'Test Urgent Short Title',
    updatedAt: '2021-08-03T20:54:18.479060Z',
    workbins: ['Grower', 'PostHarvestOperator'],
    scheduled: false,
    definitionCreatedByInternalService: true,
  },
];
