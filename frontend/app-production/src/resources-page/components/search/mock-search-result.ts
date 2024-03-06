// note: some fields are commented out below because they are not currently
// used in the front-end but likely will be in the near term.

export const mockResultWithChildren: ProdResources.ResourceState = {
  id: '8ef1cf29-5d98-4937-b5b6-db84d9a15e98',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: null,
  childResourceStateIds: [
    '85c6d8f0-75d8-43a6-9cee-e8685dbade5a',
    '62ad1a48-be00-40e3-955d-80dc3347c8e6',
    '626d7cf5-6584-447d-a3cf-9dd65f67d0f8',
  ],
  location: {
    machine: {
      traceabilityMachineId: '1d5ec62c-c0ac-43d0-899c-9d9cfa3dec7d',
      farmdefMachineId: '692b7669-59d1-46fb-9358-29527ffeeb6b',
      siteName: 'SSF2',
      areaName: 'Germination',
      lineName: 'TableGermination',
    },
    containerLocation: {
      traceabilityContainerLocationId: 'f1bdba14-4ba8-4d16-b47c-4f3bae3f76a1',
      farmdefContainerLocationRef: '692b7669-59d1-46fb-9358-29527ffeeb6b:containerLocation-Bay6',
      traceabilityMachineId: '1d5ec62c-c0ac-43d0-899c-9d9cfa3dec7d',
      index: 5,
    },
  },
  containerId: '6c9e2eed-9a44-4dff-ac80-79e5b878b8ab',
  containerLabels: [],
  containerStatus: 'IN_USE',
  containerObj: {
    createdAt: '2021-05-12T12:19:59.138Z',
    id: '6c9e2eed-9a44-4dff-ac80-79e5b878b8ab',
    serial: 'P900-0008046A:HVJJ-OGU2-RN',
    containerType: 'TABLE',
    properties: {},
  },
  materialId: 'bd94f693-1694-435a-bdfb-2ce6cd51c5f0',
  materialLabels: [],
  materialStatus: 'IN_USE',
  materialObj: {
    id: 'bd94f693-1694-435a-bdfb-2ce6cd51c5f0',
    lotName: 'e6dd1c55-f50b-4cc0-a2e9-ed5ca5119358',
    materialType: 'LOADED_TABLE',
    product: 'CRC',
    properties: {},
  },
};

export const mockResultWithParentAndChildren: ProdResources.ResourceState = {
  id: '8ef1cf29-5d98-4937-b5b6-db84d9a15e98',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: '85c6d8f0-75d8-43a6-9cee-e8685dbade5a',
  childResourceStateIds: ['62ad1a48-be00-40e3-955d-80dc3347c8e6', '626d7cf5-6584-447d-a3cf-9dd65f67d0f8'],
  location: {
    machine: {
      traceabilityMachineId: '1d5ec62c-c0ac-43d0-899c-9d9cfa3dec7d',
      farmdefMachineId: '692b7669-59d1-46fb-9358-29527ffeeb6b',
      siteName: 'SSF2',
      areaName: 'Germination',
      lineName: 'TableGermination',
    },
    containerLocation: {
      traceabilityContainerLocationId: 'f1bdba14-4ba8-4d16-b47c-4f3bae3f76a1',
      farmdefContainerLocationRef: '692b7669-59d1-46fb-9358-29527ffeeb6b:containerLocation-Bay6',
      traceabilityMachineId: '1d5ec62c-c0ac-43d0-899c-9d9cfa3dec7d',
      index: 5,
    },
  },
  containerId: '6c9e2eed-9a44-4dff-ac80-79e5b878b8ab',
  containerLabels: [],
  containerStatus: 'IN_USE',
  containerObj: {
    createdAt: '2021-05-12T12:19:59.138Z',
    id: '6c9e2eed-9a44-4dff-ac80-79e5b878b8ab',
    serial: 'P900-0008046A:HVJJ-OGU2-RN',
    containerType: 'TABLE',
    properties: {},
  },
  materialId: 'bd94f693-1694-435a-bdfb-2ce6cd51c5f0',
  materialLabels: [],
  materialStatus: 'IN_USE',
  materialObj: {
    id: 'bd94f693-1694-435a-bdfb-2ce6cd51c5f0',
    lotName: 'e6dd1c55-f50b-4cc0-a2e9-ed5ca5119358',
    materialType: 'LOADED_TABLE',
    product: 'CRC',
    properties: {},
  },
};

export const mockResultWithParent: ProdResources.ResourceState = {
  id: '8ef1cf29-5d98-4937-b5b6-db84d9a15e98',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: '85c6d8f0-75d8-43a6-9cee-e8685dbade5a',
  childResourceStateIds: [],
  location: {
    machine: {
      traceabilityMachineId: '1d5ec62c-c0ac-43d0-899c-9d9cfa3dec7d',
      farmdefMachineId: '692b7669-59d1-46fb-9358-29527ffeeb6b',
      siteName: 'SSF2',
      areaName: 'Germination',
      lineName: 'TableGermination',
    },
    containerLocation: {
      traceabilityContainerLocationId: 'f1bdba14-4ba8-4d16-b47c-4f3bae3f76a1',
      farmdefContainerLocationRef: '692b7669-59d1-46fb-9358-29527ffeeb6b:containerLocation-Bay6',
      traceabilityMachineId: '1d5ec62c-c0ac-43d0-899c-9d9cfa3dec7d',
      index: 5,
    },
  },
  containerId: '6c9e2eed-9a44-4dff-ac80-79e5b878b8ab',
  containerLabels: [],
  containerStatus: 'IN_USE',
  containerObj: {
    createdAt: '2021-05-12T12:19:59.138Z',
    id: '6c9e2eed-9a44-4dff-ac80-79e5b878b8ab',
    serial: 'P900-0008046A:HVJJ-OGU2-RN',
    containerType: 'TABLE',
    properties: {},
  },
  materialId: 'bd94f693-1694-435a-bdfb-2ce6cd51c5f0',
  materialLabels: [],
  materialStatus: 'IN_USE',
  materialObj: {
    id: 'bd94f693-1694-435a-bdfb-2ce6cd51c5f0',
    lotName: 'e6dd1c55-f50b-4cc0-a2e9-ed5ca5119358',
    materialType: 'LOADED_TABLE',
    product: 'CRC',
    properties: {},
  },
};

export const mockResult: ProdResources.ResourceState = {
  id: '03e59cd5-1580-4797-92c3-777de7d113c3',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: null,
  childResourceStateIds: [],
  location: {
    machine: {
      traceabilityMachineId: '73996afb-51d3-4ca2-8a5e-ccf4ee8b1487',
      farmdefMachineId: '32d60718-2753-4b35-b67c-58fcb88422e8',
      siteName: 'SSF2',
      areaName: 'VerticalGrow',
      lineName: 'GrowRoom',
    },
    containerLocation: {
      traceabilityContainerLocationId: 'aff9476d-3609-4007-b41c-0bfa3f0e96f4',
      farmdefContainerLocationRef: '32d60718-2753-4b35-b67c-58fcb88422e8:containerLocation-T35',
      traceabilityMachineId: '73996afb-51d3-4ca2-8a5e-ccf4ee8b1487',
      index: 35,
    },
  },
  containerId: 'a7475846-b8ea-4ddf-bd05-21bb6259bf97',
  containerLabels: ['clabel1', 'clabel2'],
  containerStatus: 'IN_USE',
  containerObj: {
    createdAt: '2021-05-12T12:19:59.138Z',
    id: 'a7475846-b8ea-4ddf-bd05-21bb6259bf97',
    serial: 'P900-0008480B:M71J-L6QB-97',
    containerType: 'TOWER',
    properties: {},
  },
  materialId: '112838bb-3687-42cc-8cd5-f8996d9522b3',
  materialLabels: ['mlabel1', 'mlabel2'],
  materialStatus: 'IN_USE',
  materialObj: {
    id: '112838bb-3687-42cc-8cd5-f8996d9522b3',
    lotName: '395bd972-a47b-42bf-b34c-ddb16610a383',
    materialType: 'LOADED_TOWER',
    product: 'B20',
    properties: {},
  },
  towerCycles: 100,
};

// had result - has neither material nor container
export const mockBadResult: ProdResources.ResourceState = {
  id: '03e59cd5-1580-4797-92c3-777de7d113c3',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: null,
  childResourceStateIds: [],
  location: {
    machine: {
      traceabilityMachineId: '73996afb-51d3-4ca2-8a5e-ccf4ee8b1487',
      farmdefMachineId: '32d60718-2753-4b35-b67c-58fcb88422e8',
      siteName: 'SSF2',
      areaName: 'VerticalGrow',
      lineName: 'GrowRoom',
    },
    containerLocation: {
      traceabilityContainerLocationId: 'aff9476d-3609-4007-b41c-0bfa3f0e96f4',
      farmdefContainerLocationRef: '32d60718-2753-4b35-b67c-58fcb88422e8:containerLocation-T35',
      traceabilityMachineId: '73996afb-51d3-4ca2-8a5e-ccf4ee8b1487',
      index: 35,
    },
  },
  containerId: null,
  containerLabels: [],
  containerStatus: null,
  containerObj: null,
  materialId: null,
  materialLabels: [],
  materialObj: null,
  materialStatus: null,
};

export const mockResultContainerOnly: ProdResources.ResourceState = {
  id: '2b9f556c-d856-4967-8619-f2380e1423ef',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: null,
  childResourceStateIds: [],
  containerId: '5f8ea983-7f06-4ab6-b8a8-2dcd5ee42714',
  containerLabels: ['Automatic Duplicate Barcode Detection'],
  containerObj: {
    createdAt: '2021-05-12T12:19:59.138Z',
    containerType: 'TOWER',
    id: '5f8ea983-7f06-4ab6-b8a8-2dcd5ee42714',
    serial: 'P900-0008480B:L78A-EI4O-VG',
    properties: {},
  },
  containerStatus: 'CLEAN',
  location: {
    containerLocation: {
      farmdefContainerLocationRef: 'f28830a2-c615-4ed1-aebd-8d42c7aec2b7:containerLocation-T53',
      index: 53,
      traceabilityContainerLocationId: '3d3ee30b-337a-4323-ae8b-2d2774c5b65d',
      traceabilityMachineId: '9012b93f-a932-4c7e-ab28-85dff0bc9b7e',
    },
    machine: {
      areaName: 'VerticalGrow',
      farmdefMachineId: 'f28830a2-c615-4ed1-aebd-8d42c7aec2b7',
      lineName: 'GrowRoom',
      siteName: 'SSF2',
      traceabilityMachineId: '9012b93f-a932-4c7e-ab28-85dff0bc9b7e',
    },
  },
  materialId: null,
  materialLabels: [],
  materialObj: null,
  materialStatus: null,
};

export const mockResultMaterialOnly: ProdResources.ResourceState = {
  id: '03e59cd5-1580-4797-92c3-777de7d113c3',
  isLatest: true,
  updatedAt: '2021-05-18T14:05:50.200Z',
  parentResourceStateId: null,
  childResourceStateIds: [],
  location: {
    machine: {
      traceabilityMachineId: '73996afb-51d3-4ca2-8a5e-ccf4ee8b1487',
      farmdefMachineId: '32d60718-2753-4b35-b67c-58fcb88422e8',
      siteName: 'SSF2',
      areaName: 'VerticalGrow',
      lineName: 'GrowRoom',
    },
    containerLocation: {
      traceabilityContainerLocationId: 'aff9476d-3609-4007-b41c-0bfa3f0e96f4',
      farmdefContainerLocationRef: '32d60718-2753-4b35-b67c-58fcb88422e8:containerLocation-T35',
      traceabilityMachineId: '73996afb-51d3-4ca2-8a5e-ccf4ee8b1487',
      index: 35,
    },
  },
  containerId: null,
  containerLabels: [],
  containerStatus: null,
  containerObj: null,
  materialId: '112838bb-3687-42cc-8cd5-f8996d9522b3',
  materialLabels: ['mlabel1', 'mlabel2'],
  materialStatus: 'IN_USE',
  materialObj: {
    id: '112838bb-3687-42cc-8cd5-f8996d9522b3',
    lotName: '395bd972-a47b-42bf-b34c-ddb16610a383',
    materialType: 'LOADED_TOWER',
    product: 'B20',
    properties: {},
  },
  quantity: 1,
  units: 'kgs',
};

export const mockResultWithCarrier: ProdResources.ResourceState = {
  childResourceStateIds: ['94d50f89-9ce0-4994-bd5b-2d1ec5549f6a'],
  containerAttributes: {
    loadedTowerSerial: '800-10000010:TOW:000-000-003',
  },
  containerId: '21a48e5a-4d7f-4948-a73d-418bc27c5cd8',
  containerLabels: [],
  containerObj: {
    containerType: 'CARRIER',
    createdAt: '2022-06-07T19:08:53.018Z',
    id: '21a48e5a-4d7f-4948-a73d-418bc27c5cd8',
    properties: {},
    serial: 'CARRIER_3_SERIAL',
  },
  containerStatus: 'IN_USE',
  id: '9ae799ab-eaa1-4e54-86f8-4644e417bc00',
  isLatest: true,
  location: {
    containerLocation: null,
    machine: {
      areaName: 'TowerAutomation',
      farmdefMachineId: '',
      lineName: 'TransferConveyance',
      siteName: 'LAX1',
      traceabilityMachineId: 'c6873370-4884-4f07-9c5a-235cb3ee072d',
    },
  },
  materialId: 'd5d20d18-26d6-400b-96bf-1b1bd177de4f',
  materialLabels: [],
  materialObj: {
    id: 'd5d20d18-26d6-400b-96bf-1b1bd177de4f',
    lotName: 'c9600dd0-f597-48c3-9257-fa97c121f239',
    materialType: 'LOADED_CARRIER',
    product: 'UNKNOWN_CROP',
    properties: {},
  },
  materialAttributes: {
    loadedInGermAt: '2022-05-01T19:08:53.101Z',
    loadedInPropAt: '2022-05-04T19:08:53.101Z',
  },
  materialStatus: 'IN_USE',
  parentResourceStateId: null,
  positionInParent: null,
  quantity: 0.0,
  units: 'NOT_SPECIFIED',
  updatedAt: '2022-06-07T19:08:53.101Z',
};

export const defaultTowerCycleResponse = {
  towerId: '234',
  cycleCount: 100,
};
