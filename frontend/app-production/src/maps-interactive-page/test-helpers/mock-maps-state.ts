import { cloneDeep } from 'lodash';

/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TableRowData } from '../components/container-details-drawer/types';
import { MapsState } from '../types';

export const mocksResourcesState: ProdResources.ResourceState[] = [
  {
    childResourceStateIds: [
      'b959fda6-e5ae-43dd-8fa9-701c780dd1b4',
      'bc97a3ef-f16b-43e9-aef2-7370c73dfa45',
      '3c4eb9dd-877c-4e7d-bb03-b9db68585352',
      '87414d09-c9fb-4533-a8d5-df0f5c67177d',
      'fe34ef92-7dcb-45b6-9b20-5ad96f959a36',
      'fa63712d-a439-4142-90c2-30057b08ba3d',
      '78c33687-19f3-4ed5-9737-9921173ca242',
      'fb545fe8-d248-436b-8cae-3c6916297cfd',
      '486a0443-0417-4691-8d20-91e2fe52f26f',
      '3cab53f6-48eb-4580-89e5-55aec66d1743',
      'ce74b754-4397-4d09-930f-274dfef20e16',
      '97393d37-7760-48e1-94dc-42598f4d451d',
      '144b87e1-c77f-498f-bcda-181ceb3c60be',
      'd4a5f937-89b4-4b15-8d86-692d00a0a058',
      '0b5fec6b-a953-4d4a-add2-8acdd48519d4',
      'b0f40b9e-67ea-4a58-9830-b85720908c8c',
      '31c440c0-3748-4c68-9412-7e0063c42bd6',
      '3e54732e-f0bc-4c59-b63d-5302a31bb7df',
      '4ba2901e-86fd-4acc-965e-66dead211fc8',
      '085ef65e-be21-4751-90bd-37926cc47c7d',
      '503f68d9-d2c9-47cb-8f99-27b1a4dff2b5',
      'bd961439-63b1-4fb7-9df1-a68f8161345e',
      'faaf3fa6-b512-4e0d-80e2-392b15c36775',
      '696737e5-b776-4065-8dcc-c82df3c1d05b',
      '577c600d-77f7-4648-b4d3-0ae4afe222f0',
      '011b537b-1585-443e-bb23-bafe0df60c5b',
      '8deacb7d-05d3-4d10-b11b-6fccf9671a48',
      'fa59d629-ff68-4538-9680-9ae15f30e15f',
      '45526c18-3987-43e2-8e98-4831a1b6069e',
      'c38f0a42-b664-4058-a970-9ea343a15433',
      '7f5ecb8c-1fee-4695-844e-2532ff708590',
      '503939a9-1ce5-44fb-ad7a-0695281b928c',
      '3aa462c1-3936-4713-9ec3-d4cd75b6db82',
      '3b018be4-6541-4f14-9a7b-10fc4418a095',
      'a8c2b211-484c-4276-8b08-74479ba6b8fb',
      'cecee7cf-809b-4425-a4a6-57dd77f797cf',
    ],
    containerId: '576d9d05-9f41-446b-9a81-e9daae5d55b3',
    containerLabels: [],
    containerObj: {
      containerType: 'TABLE',
      createdAt: '2020-09-01T20:37:31.823Z',
      id: '576d9d05-9f41-446b-9a81-e9daae5d55b3',
      properties: {},
      serial: 'P900-0008046A:M0UO-2B2E-MU',
    },
    containerStatus: 'IN_USE',
    id: '1911dca6-e95b-4c15-8d18-90c68afafb21',
    isLatest: true,
    location: {
      containerLocation: {
        farmdefContainerLocationRef: '1143ff3f-f807-4d47-a2af-31013e1d81fa:containerLocation-Bay7',
        index: 6,
        traceabilityContainerLocationId: 'b61cd287-c0b5-4550-81d9-e5ec958d5e3b',
        traceabilityMachineId: '34c4283d-164e-4c3d-a75f-2e01f180f73f',
      },
      machine: {
        areaName: 'Propagation',
        farmdefMachineId: '1143ff3f-f807-4d47-a2af-31013e1d81fa',
        lineName: 'PropagationRack',
        siteName: 'SSF2',
        traceabilityMachineId: '34c4283d-164e-4c3d-a75f-2e01f180f73f',
      },
    },
    materialId: '4da81235-0eef-4e71-92f1-fa16e6d3520d',
    materialLabels: [],
    materialObj: {
      id: '4da81235-0eef-4e71-92f1-fa16e6d3520d',
      lotName: '06d6b29c-5c00-44ba-bfb7-bdb75c17377c',
      materialType: 'LOADED_TABLE',
      product: 'BAC',
      properties: {},
    },
    materialAttributes: {},
    materialStatus: 'IN_USE',
    parentResourceStateId: null,
    positionInParent: null,
    quantity: 0.0,
    units: 'NOT_SPECIFIED',
    updatedAt: '2021-02-11T00:10:36.582Z',
  },
  {
    childResourceStateIds: [
      'af7c7bdc-b211-45e4-80c0-420d3fcd2f55',
      '42a14527-740d-49c2-aaab-ef9562b7f302',
      '861fded1-e2e3-4598-aacd-2b19a6b37451',
      '38813e5f-b764-4b00-acbc-36d6930c905f',
      'c4d545cc-21be-41bd-ad18-b7c841095e47',
      'f20d9a4f-0adb-47ae-b49a-4b896aa06900',
      '5031753c-31f9-4f5f-8791-170fbf54aa27',
      'e3d69ac8-763d-47f8-b552-b35e1fb7b9e8',
      '34e72fc9-8f83-4d74-ac94-0031cd002b75',
      'cd415c29-a7d4-4ce0-aeea-a2271287d39a',
      'fa1ff2ed-d64a-47c0-aa8d-b88c003a838e',
      '99620fa9-167e-4c9d-aa8b-5ea359b9ce36',
      'a62dafdd-9233-41b3-8dfc-ff6c746169ce',
      '3815e647-90b9-46ba-a123-d70c64f9c2d7',
      'e28ab907-acc3-4a9d-b878-388d611cbcef',
      '38f30abc-34c2-4f48-9e97-e3cf70574552',
      'b521f218-9f1b-4c78-899f-9e38c8134db7',
      'ac2b5336-0f71-43d5-90a0-a50b5f9ac352',
      'd9c1c48f-acbd-40e1-9e6d-3e9c0042e27e',
      'bd0264bd-fcb3-4186-8b69-c1ca09ee14e7',
      'd7c85a7f-f1a4-40cb-b9e4-d9ffe24cd46c',
      '291b7649-be7e-4140-a01a-4cbef659d7f8',
      '8ec98bdc-ca61-4f62-a842-d5cc92c12db0',
      '30042d5d-6061-4640-b9e9-a306ef687614',
      '1ad450e9-7f4b-48b8-9e72-41adcf773f4a',
      'aca51073-7533-4c90-8382-79e4a13d7802',
      '017c75c2-46b9-45fa-acac-3abdfd5cc65c',
      '7e2971d0-c37c-485c-ba77-50dda96895f6',
      'e6a09143-2c5c-4997-80b6-854e466e9c4a',
      'eb16a044-4db1-4b2e-9783-b53d9c3e06b8',
      'b3477f0e-134c-4842-a32d-17ff7cf1739c',
      '680c09db-6ce3-4abe-851f-f02057f3a8ff',
      '179a0f42-6e82-4430-a19f-93bca1b4ea87',
      'c85513d4-2afe-485c-81ba-b326ed80ad85',
      'f25dd002-2833-4eb5-8e8a-54ed9e31aa33',
      '9e578081-9850-4422-8991-3c53455fde07',
    ],
    containerId: '63852572-eca8-4294-a51a-e3e9bccacb01',
    containerLabels: [],
    containerObj: {
      containerType: 'TABLE',
      createdAt: '2020-09-01T13:40:08.928Z',
      id: '63852572-eca8-4294-a51a-e3e9bccacb01',
      properties: {},
      serial: 'P900-0008046A:GKXJ-SOP4-PX',
    },
    containerStatus: 'IN_USE',
    id: '1feabf20-783f-4063-914c-ed365a0dcf92',
    isLatest: true,
    location: {
      containerLocation: {
        farmdefContainerLocationRef: '2132d202-d546-4c35-b9a1-869b1fbd3a39:containerLocation-Bay9',
        index: 8,
        traceabilityContainerLocationId: 'ed7757a3-76a7-47fd-b6df-794df016b1f9',
        traceabilityMachineId: '9f4049f5-8464-47b4-a8e1-8af2ad7b1a0a',
      },
      machine: {
        areaName: 'Propagation',
        farmdefMachineId: '2132d202-d546-4c35-b9a1-869b1fbd3a39',
        lineName: 'PropagationRack',
        siteName: 'SSF2',
        traceabilityMachineId: '9f4049f5-8464-47b4-a8e1-8af2ad7b1a0a',
      },
    },
    materialId: 'a7589661-e9b9-4183-adb8-baaadbd413d8',
    materialLabels: [],
    materialObj: {
      id: 'a7589661-e9b9-4183-adb8-baaadbd413d8',
      lotName: '412d82b3-e492-4163-8e4d-c135e2064f12',
      materialType: 'LOADED_TABLE',
      product: 'BAC',
      properties: {},
    },
    materialStatus: 'IN_USE',
    parentResourceStateId: null,
    positionInParent: null,
    quantity: 0.0,
    units: 'NOT_SPECIFIED',
    updatedAt: '2021-02-10T23:35:15.608Z',
  },
  {
    childResourceStateIds: [
      'e4af7ddd-6cc9-4481-a025-c87c6fee770d',
      '1268bc73-6f42-43e7-83e3-499c99bcf37c',
      'ef5c5197-a75f-45da-af7a-80571fc1a3a1',
      '2b22886b-25a9-4b5e-926b-dad62ac8c308',
      '60c5d8d1-a912-46a8-919a-4540376ad45b',
      '037fc10d-af23-46af-906e-1a9c468217c2',
      '1e48ca1a-7169-496b-ab44-942e4f694883',
      '7db1a1cc-2f8f-4fe7-961c-e629d415fce5',
      'c1751147-a52b-4ec9-8486-4d5d33cec497',
      '9edcb344-e832-4f9f-852d-e72cbc7e77d8',
      'b3f26154-d231-4733-bd7f-02759da40ddf',
      '58a3de2a-39e4-4852-a684-a083bd7f1591',
      '14cae319-5b0a-4a12-8b0e-9edf12d2105f',
      'b96844dd-6ba8-402e-a1f3-ea022c6fe7fa',
      'c0945382-9eca-4098-a609-2c4ab49d57cd',
      '5890ecbf-95a0-4ecd-92fd-29aaf204f306',
      'a7cb9f2d-334e-43e5-beca-a851238d0701',
      'a26a9581-f9a0-4b7f-a970-51415eafa7f0',
      'ef796c33-9991-4e8f-a684-ce600ac49928',
      '99919b31-e08e-4a9b-be62-72c63afd1eb1',
      'cb1ea1c4-12a8-4790-920b-3ee8240c7913',
      '9cce751a-274c-4066-acec-3df86da8d39c',
      '5e695803-bc49-4de8-8f53-e4bab9d5f128',
      '8bf934bb-f8df-4442-b065-122b454e4bfc',
      '101abab3-0bf5-4eff-a14a-7248b6ce904a',
      '9650aca9-4591-4e23-b11c-a457829b6533',
      'b7f1586d-da20-40c3-a611-646f04a734ce',
      '807aa3df-06e4-4a52-ba6c-c3b76769b58b',
      '4b434782-03ac-450e-beae-18748b08129f',
      '26b4a38e-4b1c-44c6-ad45-2b9129406382',
      '8c45abb2-3d1f-419c-8389-88cfefe572e1',
      '7ce04785-45f9-4b90-934e-860b97cc783d',
      '5cd871de-ca18-41b2-aec4-0d17e06ee12b',
      '1baf9b76-d1c2-41da-8df6-4cefda925a31',
      '1a146a3f-117f-4f22-b8c0-7776c49cae67',
      'f2e9ec88-7b31-4b55-a060-8ae7bfdc75a2',
    ],
    containerId: '22211a8e-3fab-4383-9d43-30e233e6020f',
    containerLabels: [],
    containerObj: {
      containerType: 'TABLE',
      createdAt: '2020-09-01T13:40:08.610Z',
      id: '22211a8e-3fab-4383-9d43-30e233e6020f',
      properties: {},
      serial: 'P900-0008046A:CWS6-7POV-3H',
    },
    containerStatus: 'IN_USE',
    id: '5bd4b20c-fee6-4136-b58b-6f1b10cb2d3e',
    isLatest: true,
    location: {
      containerLocation: {
        farmdefContainerLocationRef: '3684fc97-74e3-40d0-ad4c-b5896c30a394:containerLocation-Bay8',
        index: 7,
        traceabilityContainerLocationId: 'acf32863-59a1-464b-b0f3-af1d17de655e',
        traceabilityMachineId: '9c7f3f63-6d95-4d71-bd5c-f3a6a2e13a84',
      },
      machine: {
        areaName: 'Propagation',
        farmdefMachineId: '3684fc97-74e3-40d0-ad4c-b5896c30a394',
        lineName: 'PropagationRack',
        siteName: 'SSF2',
        traceabilityMachineId: '9c7f3f63-6d95-4d71-bd5c-f3a6a2e13a84',
      },
    },
    materialId: 'b3ab0a23-46d9-4b93-b5ec-25ddad27d18c',
    materialLabels: [],
    materialObj: {
      id: 'b3ab0a23-46d9-4b93-b5ec-25ddad27d18c',
      lotName: 'a728cf39-d2c1-4034-9570-aa8128292e9f',
      materialType: 'LOADED_TABLE',
      product: 'BAC,WHC',
      properties: {},
    },
    materialStatus: 'IN_USE',
    parentResourceStateId: null,
    positionInParent: null,
    quantity: 0.0,
    units: 'NOT_SPECIFIED',
    updatedAt: '2021-02-10T20:18:40.700Z',
  },
  {
    childResourceStateIds: [],
    containerId: '632a4625-9b60-4372-99a4-6e27b796c975',
    containerLabels: [],
    containerObj: {
      containerType: 'TABLE',
      createdAt: '2020-09-02T13:49:58.389Z',
      id: '632a4625-9b60-4372-99a4-6e27b796c975',
      properties: {},
      serial: 'P900-0008046A:S0ZW-2BEL-NV',
    },
    containerStatus: 'CLEAN',
    id: 'a986b4c7-0dc9-42cb-beda-f7a1d75f16c3',
    isLatest: true,
    location: {
      containerLocation: {
        farmdefContainerLocationRef: '051e6061-5b07-45ff-badb-bd41c91a3d3e:containerLocation-Bay1',
        index: 0,
        traceabilityContainerLocationId: '6128c982-09de-45e9-b471-a764b3a03683',
        traceabilityMachineId: '84d2564f-7aa7-4387-a9bb-217f9b892ffa',
      },
      machine: {
        areaName: 'Propagation',
        farmdefMachineId: '051e6061-5b07-45ff-badb-bd41c91a3d3e',
        lineName: 'PropagationRack',
        siteName: 'SSF2',
        traceabilityMachineId: '84d2564f-7aa7-4387-a9bb-217f9b892ffa',
      },
    },
    materialId: null,
    materialLabels: [],
    materialObj: null,
    materialStatus: null,
    parentResourceStateId: null,
    positionInParent: null,
    quantity: 0.0,
    units: 'NOT_SPECIFIED',
    updatedAt: '2021-02-09T22:13:57.504Z',
  },
];

export const mocksChildResources: ProdResources.ResourceState[] = [
  {
    childResourceStateIds: [],
    containerId: 'c5d66778-8aea-44a7-8ab0-72b7c9b5b451',
    containerLabels: [],
    containerObj: {
      containerType: 'TRAY',
      createdAt: '2020-09-08T14:48:27.342Z',
      id: 'c5d66778-8aea-44a7-8ab0-72b7c9b5b451',
      properties: {},
      serial: 'P900-0008529A:ENYL-5V43-QN',
    },
    containerStatus: 'IN_USE',
    id: 'b085181c-defe-4655-a3eb-4cb2482809e1',
    isLatest: true,
    location: {
      containerLocation: null,
      machine: {
        areaName: 'TableProcessing',
        farmdefMachineId: 'd1276dd3-9f0d-4c1c-8673-ce7751305ae9',
        lineName: 'IngressLine',
        siteName: 'SSF2',
        traceabilityMachineId: '635b33f9-fda2-42fa-b701-c6f5c23b3f7f',
      },
    },
    materialId: '16820b78-2ca6-4acf-aef5-c4f55cbc52e5',
    materialLabels: [],
    materialObj: {
      id: '16820b78-2ca6-4acf-aef5-c4f55cbc52e5',
      lotName: '89eee5d5-9d7b-4304-912d-4d93c64ecf0a',
      materialType: 'LOADED_TRAY',
      product: 'WHC',
      properties: {},
    },
    materialStatus: 'IN_USE',
    parentResourceStateId: 'c787a5cd-7ae1-4c75-ab2f-999f291641a6',
    positionInParent: 'C1',
    quantity: 0,
    units: 'NOT_SPECIFIED',
    updatedAt: '2021-02-04T17:03:23.904Z',
  },
];

// first two have single crop: 'BAC'
// third has two crops: 'BAC,WHC'
// last is clean table
export const mockMapsState: MapsState = {
  [mocksResourcesState[0].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[0],
  },
  [mocksResourcesState[1].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[1],
  },
  [mocksResourcesState[2].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[2],
  },
  [mocksResourcesState[3].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[3],
  },
};

// modify first resource to have two labels:
export const mockMapsStateWithLabels = cloneDeep(mockMapsState);
export const mockContainerLocationRefWithLabels = Object.keys(mockMapsStateWithLabels)[0];
export const testLabels = ['test_container_label', 'test_material_label'];
mockMapsStateWithLabels[mockContainerLocationRefWithLabels].resourceState.containerLabels = [testLabels[0]];
mockMapsStateWithLabels[mockContainerLocationRefWithLabels].resourceState.materialLabels = [testLabels[1]];

export const mockMapsStateWithThreeCrops = {
  [mocksResourcesState[2].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: {
      ...mocksResourcesState[2],
      materialObj: { ...mocksResourcesState[2].materialObj, product: 'BAC,WHC,SAS' },
    },
  },
};

export const mockMapsStateWithLoadDataMaterialAttributes: MapsState = {
  [mocksResourcesState[0].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: {
      ...mocksResourcesState[0],
      materialAttributes: {
        loadedInPropAt: '2021-02-11T00:10:36.582Z',
      },
    },
  },
  [mocksResourcesState[1].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: {
      ...mocksResourcesState[1],
      materialAttributes: {
        loadedInPropAt: '2021-02-12T00:10:36.582Z',
      },
    },
  },
  [mocksResourcesState[2].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: {
      ...mocksResourcesState[2],
      materialAttributes: {
        loadedInPropAt: '2021-02-13T00:10:36.582Z',
      },
    },
  },
  [mocksResourcesState[3].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: {
      ...mocksResourcesState[3],
      materialAttributes: {
        loadedInPropAt: '2021-02-14T00:10:36.582Z',
      },
    },
  },
};

export const mockMapsStateWithLoadDataLastLoadOperation: MapsState = {
  [mocksResourcesState[0].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[0],
    lastLoadOperation: {
      startDt: '2021-02-11T00:10:36.582Z',
    } as ProdResources.Operation,
  },
  [mocksResourcesState[1].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[1],
    lastLoadOperation: {
      startDt: '2021-02-12T00:10:36.582Z',
    } as ProdResources.Operation,
  },
  [mocksResourcesState[2].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[2],
    lastLoadOperation: {
      startDt: '2021-02-13T00:10:36.582Z',
    } as ProdResources.Operation,
  },
  [mocksResourcesState[3].location.containerLocation.farmdefContainerLocationRef]: {
    resourceState: mocksResourcesState[3],
    lastLoadOperation: {
      startDt: '2021-02-14T00:10:36.582Z',
    } as ProdResources.Operation,
  },
};

export const mockChildResourcesMapsState: MapsState = {
  C1: {
    resourceState: {
      childResourceStateIds: [],
      containerId: 'c5d66778-8aea-44a7-8ab0-72b7c9b5b451',
      containerLabels: [],
      containerObj: {
        containerType: 'TRAY',
        createdAt: '2020-09-08T14:48:27.342Z',
        id: 'c5d66778-8aea-44a7-8ab0-72b7c9b5b451',
        properties: {},
        serial: 'P900-0008529A:ENYL-5V43-QN',
      },
      containerStatus: 'IN_USE',
      id: 'b085181c-defe-4655-a3eb-4cb2482809e1',
      isLatest: true,
      location: {
        containerLocation: null,
        machine: {
          areaName: 'TableProcessing',
          farmdefMachineId: 'd1276dd3-9f0d-4c1c-8673-ce7751305ae9',
          lineName: 'IngressLine',
          siteName: 'SSF2',
          traceabilityMachineId: '635b33f9-fda2-42fa-b701-c6f5c23b3f7f',
        },
      },
      materialId: '16820b78-2ca6-4acf-aef5-c4f55cbc52e5',
      materialLabels: [],
      materialObj: {
        id: '16820b78-2ca6-4acf-aef5-c4f55cbc52e5',
        lotName: '89eee5d5-9d7b-4304-912d-4d93c64ecf0a',
        materialType: 'LOADED_TRAY',
        product: 'WHC',
        properties: {},
      },
      materialStatus: 'IN_USE',
      parentResourceStateId: 'c787a5cd-7ae1-4c75-ab2f-999f291641a6',
      positionInParent: 'C1',
      quantity: 0,
      units: 'NOT_SPECIFIED',
      updatedAt: '2021-02-04T17:03:23.904Z',
    },
  },
};

export const mockTableRowsFromMapState: TableRowData[] = [
  {
    rowName: 'C',
    resources: [mockChildResourcesMapsState.C1.resourceState],
  },
];

export const mockTowerResource = {
  childResourceStateIds: [],
  containerAttributes: {},
  containerId: '26c69bd0-f877-402a-ae2e-7dd0663d259d',
  containerLabels: ['Broken Tower'],
  containerObj: {
    containerType: 'TOWER',
    createdAt: '2020-09-01T14:58:01.836Z',
    id: '26c69bd0-f877-402a-ae2e-7dd0663d259d',
    properties: {},
    serial: 'P900-0008480B:M8NG-0KJU-0F',
    updatedAt: '2020-11-25T16:00:29.436Z',
  },
  containerStatus: 'DIRTY',
  createdAt: '2022-08-04T23:50:29.200Z',
  id: '4e9f1e30-11e6-4445-8677-27707ddc10a0',
  isLatest: true,
  location: {
    containerLocation: {
      createdAt: '2022-08-03T16:51:05.679Z',
      detailedLocation: {},
      farmDefPath: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine1/containerLocations/A208',
      farmdefContainerLocationRef: 'ae5a11d5-d959-458c-8af7-3fb98a1d6039:containerLocation-A208',
      index: 209,
      traceabilityContainerLocationId: 'a4a401b4-d280-44ba-a276-ab4708c53d3a',
      traceabilityMachineId: '4d5cbca0-f08f-4442-a383-f65e4b67b9d2',
      updatedAt: '2022-08-04T23:50:29.200Z',
    },
    machine: {
      areaName: 'VerticalGrow',
      createdAt: '2021-07-16T20:56:43.258Z',
      farmdefMachineId: 'ae5a11d5-d959-458c-8af7-3fb98a1d6039',
      lineName: 'GrowRoom1',
      siteName: 'LAX1',
      traceabilityMachineId: '4d5cbca0-f08f-4442-a383-f65e4b67b9d2',
      updatedAt: '2021-07-16T20:56:43.258Z',
    },
  },
  materialAttributes: {},
  materialId: null,
  materialLabels: [],
  materialObj: null,
  materialStatus: null,
  parentResourceStateId: null,
  positionInParent: null,
  quantity: 0,
  units: 'NOT_SPECIFIED',
  updatedAt: '2022-08-04T23:50:29.200Z',
};
