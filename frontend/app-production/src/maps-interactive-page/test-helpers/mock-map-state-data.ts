import { ContainerLocation } from '@plentyag/core/src/farm-def/types';

import { MapsState } from '../types';

export const mockMapStateForTable: MapsState = {
  '10a6b3ef-a246-49f6-948b-62c77b9ed595:containerLocation-Bay1': {
    lastLoadOperation: null,
    resourceState: {
      childResourceStateIds: [
        '48072acd-cf91-4882-8c54-719c8ccd0a38',
        'ba7f203f-7b25-4ea5-9f8a-d656a6699821',
        'd3aabd7e-c55f-43e2-8457-94ab8558bc03',
        'f8856fa9-fbc4-47a6-a5ae-778ec9ca9745',
        'ecb02211-abcf-475b-89e3-9cd282ecd829',
        'e97d4781-ab7d-48e2-bb91-726a0d2add75',
        'd77a9059-16c1-4126-8400-51e2711f2603',
        'b7c0adfa-61b7-4055-8e48-ef9e585ce1f7',
        '7855fea8-6f5b-403a-af22-e9c8bbb36f9d',
        'd3853454-452c-41f4-a84f-e23a5a61eb40',
        '1fb7b217-d5d7-457b-8420-8eab240c186d',
        'b406467f-241d-4448-a91d-4152c2288abe',
        '010080bc-2801-4ee5-85e7-8a3568b7324d',
        '56b10176-d208-4c03-b573-4f705573b078',
        'b6f921c0-c65e-47da-a572-76ac8701d087',
        'bfe636f0-8613-4441-8157-2cf588e93f1f',
        'a330e7e2-85b7-4da0-bc34-04370902bc02',
        '765d4d8a-4080-42ed-a88e-549674cb2b75',
        '6f0bd704-3896-490c-a08e-7a00241d57a5',
        '89785df2-cede-4ef4-89e4-84398d96d02a',
        '4183aa02-a54f-4d1d-9d32-672037e792ff',
        'cffcf340-7f23-4e88-a86e-2f2d9de7276e',
        '1298e0dc-e017-428f-814f-8c09f07be185',
        'bd08e4cc-f5fa-4a4b-8808-a81f1a38b6c7',
        'e348530e-33aa-49da-b942-107cef6f473a',
        '2bccfeff-2ab7-452b-8533-c8ae8ef23aea',
        'bb1aca29-72ef-4489-8233-c78c04d9ac3b',
        'e99f251e-d556-4e0e-8f73-2802f8ebabf2',
        '48795c08-49e3-4316-8748-368e81ad9562',
        '3aeeafbe-2589-4999-87cc-3609771b69ac',
        '78b1b44b-4659-46bf-99e6-3ea112c35cc6',
        '855d744f-b8c5-4b00-b5e7-f52fb91e2287',
        'b4b2ac39-082d-472f-ac8b-1ce7c6a1d5ab',
        '9a9e4a2a-39ea-431b-940e-010ba4c6bb76',
        'ed37781b-a7cc-4ca9-8e43-53ad6a60d622',
        '5c90d455-b096-4617-9337-319d3a74177d',
      ],
      containerAttributes: {},
      containerId: '9259cd46-fd6c-483b-bc4b-7b440e813f52',
      containerLabels: [],
      containerObj: {
        containerType: 'TABLE',
        createdAt: '2020-09-01T13:52:00.657Z',
        id: '9259cd46-fd6c-483b-bc4b-7b440e813f52',
        properties: {},
        serial: 'P900-0008046A:IK8N-VN7N-XT',
        updatedAt: '2020-11-25T22:51:23.204Z',
      },
      containerStatus: 'IN_USE',
      id: '7a4be058-bdcf-4ac4-8345-44751d058b79',
      isLatest: true,
      location: {
        containerLocation: {
          farmDefPath: '',
          farmdefContainerLocationRef: '10a6b3ef-a246-49f6-948b-62c77b9ed595:containerLocation-Bay1',
          index: 0,
          traceabilityContainerLocationId: '7248a971-fc51-433d-985b-b9be1e190419',
          traceabilityMachineId: '1c51a94d-be50-422b-965d-e27273445180',
        },
        machine: {
          areaName: 'Germination',
          farmdefMachineId: '10a6b3ef-a246-49f6-948b-62c77b9ed595',
          lineName: 'TableGermination',
          siteName: 'SSF2',
          traceabilityMachineId: '1c51a94d-be50-422b-965d-e27273445180',
        },
      },
      materialAttributes: {
        loadedInGermAt: '2022-05-01T10:54:24.280Z',
        loadedInPropAt: '2022-05-19T12:54:24.280Z',
      },
      materialId: '131ff7aa-8b59-4fa4-a549-2d3a99ce3427',
      materialLabels: [],
      materialObj: {
        createdAt: '2022-05-31T14:48:39.385Z',
        id: '131ff7aa-8b59-4fa4-a549-2d3a99ce3427',
        lotName: '8e743188-35cd-4af4-a799-ff16ae936591',
        materialType: 'LOADED_TABLE',
        product: 'WHC',
        properties: {},
        updatedAt: '2022-05-31T14:48:39.385Z',
      },
      materialStatus: 'IN_USE',
      parentResourceStateId: null,
      positionInParent: null,
      quantity: 0.0,
      units: 'NOT_SPECIFIED',
      updatedAt: '2022-05-31T14:54:24.280Z',
    },
  },
};

export const mockTowerResourceState: ProdResources.ResourceState = {
  childResourceStateIds: [],
  containerAttributes: {},
  containerId: 'ee0e78bf-d36c-4262-9b1f-e43a85771375',
  containerLabels: [],
  containerObj: {
    containerType: 'TOWER',
    createdAt: '2022-04-21T00:55:32.782Z',
    id: 'ee0e78bf-d36c-4262-9b1f-e43a85771375',
    properties: {},
    serial: 'P900-0008480B:UVJ3-7OMG-NY',
  },
  containerStatus: 'CLEAN',
  id: 'a36efd1e-5d45-430a-b204-5e176e9a5ae4',
  isLatest: true,
  location: {
    containerLocation: {
      farmdefContainerLocationRef: '123-abc:containerLocation-T1',
      index: 1,
      traceabilityContainerLocationId: 'c8627f43-fee5-450d-8b63-0d92cb8cfa2a',
      traceabilityMachineId: '959e4cfc-fbe0-4a39-9546-47a37078d067',
    },
    machine: {
      areaName: 'VerticalGrow',
      farmdefMachineId: '6bbfdd50-2329-4b6e-bc8e-5d5bc3321673',
      lineName: 'GrowRoom',
      siteName: 'SSF2',
      traceabilityMachineId: '959e4cfc-fbe0-4a39-9546-47a37078d067',
    },
  },
  materialId: '7939535a-6967-4e17-ae88-84c00f9c5ef9',
  materialLabels: [],
  materialObj: {
    id: '7939535a-6967-4e17-ae88-84c00f9c5ef9',
    lotName: '6a896f0f-b8aa-48a4-84e1-b394f3d9bd40',
    materialType: 'LOADED_TOWER',
    product: 'MZC',
    properties: {},
  },
  materialAttributes: {
    loadedInGrowAt: '2022-04-16T12:54:24.280Z',
  },
  materialStatus: null,
  parentResourceStateId: null,
  positionInParent: null,
  quantity: 0,
  units: 'NOT_SPECIFIED',
  updatedAt: '2022-06-17T15:49:44.501Z',
};

export const mockMapStateForTower: MapsState = {
  '123-abc:containerLocation-T1': {
    lastLoadOperation: null,
    resourceState: mockTowerResourceState,
  },
};

export const mockConflictMapStateForTower: MapsState = {
  '123-abc:containerLocation-T1': {
    lastLoadOperation: null,
    resourceState: null,
    conflicts: [
      {
        resourceState: mockTowerResourceState,
      },
      {
        resourceState: mockTowerResourceState,
      },
    ],
  },
};

export const mockContainerLocation: ContainerLocation = {
  ref: '123-abc:containerLocation-T1',
  kind: 'containerLocation',
  index: 1,
  name: '123-abc',
  path: '',
  class: '',
  parentId: '',
  parentPath: '',
  properties: {},
  containerTypes: [],
};
