export const mockTrays: ProdResources.ResourceState[] = [
  {
    id: null,
    parentResourceStateId: null,
    positionInParent: null,
    childResourceStateIds: [],
    location: {
      machine: {
        traceabilityMachineId: null,
        farmdefMachineId: '0ae9d8dc-58b4-4472-94fa-40f3cf176c9e',
        siteName: 'LAX1',
        areaName: 'TowerAutomation',
        lineName: 'TowerProcessing',
      },
      containerLocation: null,
    },
    containerId: null,
    containerLabels: ['TRAY_INSPECTION_BYPASSED', 'QAQC_SAMPLE', 'TRAY_INSPECTED', 'PHOTO_TAKEN'],
    containerStatus: 'IN_USE',
    containerAttributes: {},
    containerObj: {
      id: 'b34b7992-83cb-4ca8-a604-401a32cb0c0b',
      serial: '800-00013031:TRY:000-017-623',
      containerType: 'TRAY',
      createdAt: null,
      updatedAt: null,
      properties: {},
    },
    materialId: null,
    materialLabels: [],
    materialStatus: 'IN_USE',
    materialAttributes: {},
    materialObj: {
      id: null,
      lotName: '86d77c9c-a58d-45ca-b1c8-4e7e5b2ab24f',
      materialType: 'LOADED_TRAY',
      product: 'SAS',
      createdAt: null,
      updatedAt: null,
      properties: {
        inlineSeedlingInspectionJson:
          '{"lowEmergence": 1.0, "leggy": 0.0, "stunted": 0.0, "discoloration": 0.06499999761581421, "foreignObject": 0.0, "EVM": 0.0, "armPresent": 0.0}',
      },
    },
    updatedAt: null,
    isLatest: null,
  },
];
