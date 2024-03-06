export const mockTransplanerOutfeedTowers: ProdResources.ResourceState[] = [
  {
    id: '1cdef144-655d-4f29-a5c8-bdfba72ddb6d',
    parentResourceStateId: null,
    positionInParent: null,
    childResourceStateIds: [],
    location: {
      machine: {
        traceabilityMachineId: 'af37bfac-04cf-47d0-ba46-43b2aa8b7ad1',
        farmdefMachineId: '0ae9d8dc-58b4-4472-94fa-40f3cf176c9e',
        siteName: 'LAX1',
        areaName: 'TowerAutomation',
        lineName: 'TowerProcessing',
      },
      containerLocation: {
        traceabilityContainerLocationId: '80b976bf-6845-4469-8c02-0effb8f2a470',
        farmDefPath:
          'sites/LAX1/areas/TowerAutomation/lines/TowerProcessing/machines/Transplanter/containerLocations/TransplanterOutfeed',
        farmdefContainerLocationRef: '0ae9d8dc-58b4-4472-94fa-40f3cf176c9e:containerLocation-TransplanterOutfeed',
        traceabilityMachineId: 'af37bfac-04cf-47d0-ba46-43b2aa8b7ad1',
        index: 1,
      },
    },
    containerId: '4c8afedb-a4cd-46df-a491-127069297248',
    containerLabels: [],
    containerStatus: 'IN_USE',
    containerAttributes: {},
    containerObj: {
      id: '4c8afedb-a4cd-46df-a491-127069297248',
      serial: '800-00011957:TOW:000-004-429',
      containerType: 'TOWER',
      createdAt: '2022-12-08T04:17:03.177Z',
      updatedAt: '2022-12-08T04:17:03.177Z',
      properties: {},
    },
    materialId: 'c5b726bc-fe95-4962-89b0-4ba69dc2c448',
    materialLabels: [],
    materialStatus: 'IN_USE',
    materialAttributes: {},
    materialObj: {
      id: 'c5b726bc-fe95-4962-89b0-4ba69dc2c448',
      lotName: 'f9b64bbf-6061-4be1-80cf-11e6a68ad447',
      materialType: 'LOADED_TOWER',
      product: 'CRC',
      createdAt: '2023-04-11T18:11:51.021Z',
      updatedAt: '2023-04-11T18:11:51.197Z',
      properties: {
        towerTransplantResults:
          '{\n  "pattern": 2,\n  "towerSerial": "800-00011957:TOW:000-004-429",\n  "traySerial1": "800-00013031:TRY:000-017-029",\n  "traySerial2": "800-00013031:TRY:000-035-847",\n  "traySerial3": "800-00013031:TRY:000-012-537",\n  "traySerial4": "800-00013031:TRY:000-001-132",\n  "traySerial5": "800-00013031:TRY:000-029-316",\n  "traySerial6": "800-00013031:TRY:000-027-370",\n  "traySerial7": "800-00013031:TRY:000-024-005",\n  "traySerial8": "800-00013031:TRY:000-025-092",\n  "towerResult": 1\n}',
      },
    },
    updatedAt: '2023-04-11T18:14:01.095Z',
    isLatest: true,
    quantity: 0.0,
    units: 'PLUGS',
  },
];
