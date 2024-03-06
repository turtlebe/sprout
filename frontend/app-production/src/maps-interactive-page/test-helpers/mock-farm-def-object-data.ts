export const mockFarmDefSite: any = {
  name: 'SSF2',
  kind: 'site',
  id: '123-abc',
  path: 'sites/SSF2',
  class: 'TigrisSite',
  farms: {
    Tigris: {
      kind: 'farm',
      displayName: 'Tigris',
      class: 'Farm',
      path: 'sites/SSF2/farms/Tigris',
      name: 'Farm',
      properties: {},
      mappings: [
        {
          from: '123-abc',
          to: '123-abc',
          kind: 'mapping',
          type: 'relates',
        },
      ],
    },
  },
  areas: {
    VerticalGrow: {
      id: '123-abc',
      kind: 'area',
      displayName: 'Vertical Grow',
      class: 'VerticalGrow',
      path: 'sites/SSF2/areas/VerticalGrow',
      name: 'VerticalGrow',
      lines: {
        GrowRoom1: {
          id: '123-abc',
          kind: 'line',
          displayName: 'Grow Room 1',
          class: 'GrowRoom',
          path: 'sites/SSF2/areas/Propagation/lines/GrowRoom1',
          name: 'GrowRoom1',
          properties: {},
        },
      },
      properties: {},
    },
  },
};

export const mockFarmDefSiteWithUnsupportedArea: any = {
  name: 'SSF2',
  kind: 'site',
  id: '123-abc',
  path: 'sites/SSF2',
  class: 'TigrisSite',
  farms: {
    Tigris: {
      kind: 'farm',
      displayName: 'Tigris',
      class: 'Farm',
      path: 'sites/SSF2/farms/Tigris',
      name: 'Farm',
      properties: {},
      mappings: [
        {
          from: '123-abc',
          to: '123-abc',
          kind: 'mapping',
          type: 'relates',
        },
      ],
    },
  },
  areas: {
    UnsupportedArea: {
      id: '123-abc',
      kind: 'area',
      displayName: 'Unsupported Area',
      class: 'UnsupportedArea',
      path: 'sites/SSF2/areas/UnsupportedArea',
      name: 'UnsupportedArea',
      lines: {
        GrowRoom1: {
          id: '123-abc',
          kind: 'line',
          displayName: 'Grow Room 1',
          class: 'GrowRoom',
          path: 'sites/SSF2/areas/Propagation/lines/GrowRoom1',
          name: 'GrowRoom1',
          properties: {},
        },
      },
      properties: {},
    },
  },
};

export const mockFarmDefSiteWithUnsupportedLine: any = {
  name: 'SSF2',
  kind: 'site',
  id: '123-abc',
  path: 'sites/SSF2',
  class: 'TigrisSite',
  farms: {
    Tigris: {
      kind: 'farm',
      displayName: 'Tigris',
      class: 'Farm',
      path: 'sites/SSF2/farms/Tigris',
      name: 'Farm',
      properties: {},
      mappings: [
        {
          from: '123-abc',
          to: '123-abc',
          kind: 'mapping',
          type: 'relates',
        },
      ],
    },
  },
  areas: {
    VerticalGrow: {
      id: '123-abc',
      kind: 'area',
      displayName: 'Vertical Grow',
      class: 'VerticalGrow',
      path: 'sites/SSF2/areas/VerticalGrow',
      name: 'VerticalGrow',
      lines: {
        UnsupportedLine: {
          id: '123-abc',
          kind: 'line',
          displayName: 'UnsupportedLine',
          class: 'UnsupportedLine',
          path: 'sites/SSF2/areas/VerticalGrow/lines/PrimaryPostHarvest',
          name: 'UnsupportedLine',
          properties: {},
        },
      },
      properties: {},
    },
  },
};

export const mockFarmDefContainerLocations: any = {
  name: 'T1',
  kind: 'containerLocation',
  path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/containerLocations/T1',
  ref: '123-abc:containerLocation-T1',
  class: 'TowerIndex',
  properties: {},
  containerTypes: ['Tower'],
  index: 1,
  mappings: [],
};

export const mockFarmDefContainerLocationsWithTable: any = {
  name: 'Bay1',
  kind: 'containerLocation',
  path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1/containerLocations/Bay1',
  ref: '123-abc:containerLocation-Bay1',
  class: 'GermBay',
  properties: {},
  containerTypes: ['Table'],
  index: 1,
  mappings: [],
};

export const mockFarmDefMachine: any = {
  name: 'GrowLane1',
  kind: 'machine',
  path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1',
  id: '123-abc',
  displayName: 'Grow Lane 1',
  displayAbbreviation: 'GL1',
  class: 'GrowLane',
  generation: 'default',
  containerLocations: {
    [mockFarmDefContainerLocations.name]: mockFarmDefContainerLocations,
  },
};

export const mockFarmDefMachineGermination: any = {
  name: 'GermChamber1',
  kind: 'machine',
  path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
  id: '123-abc',
  displayName: 'Germ Chamber 1',
  class: 'GerminationChamber',
  generation: 'default',
  containerLocations: {
    [mockFarmDefContainerLocationsWithTable.name]: mockFarmDefContainerLocationsWithTable,
  },
};

export const mockFarmDefMachineUturnStyle: any = {
  ...mockFarmDefMachine,
  containerLocations: {
    A0: {
      ...mockFarmDefContainerLocations,
      name: 'A0',
      properties: { lane: 'A' },
      index: 1,
    },
    A1: {
      ...mockFarmDefContainerLocations,
      name: 'A1',
      properties: { lane: 'A' },
      index: 2,
    },
    B0: {
      ...mockFarmDefContainerLocations,
      name: 'B0',
      properties: { lane: 'B' },
      index: 4,
    },
    B2: {
      ...mockFarmDefContainerLocations,
      name: 'B2',
      properties: { lane: 'B' },
      index: 6,
    },
    B1: {
      ...mockFarmDefContainerLocations,
      name: 'B1',
      properties: { lane: 'B' },
      index: 5,
    },
    UTurn: {
      ...mockFarmDefContainerLocations,
      name: 'UTurn',
      properties: { lane: '-' },
      index: 3,
    },
  },
};

export const mockFarmDefMachineSStyle: any = {
  ...mockFarmDefMachine,
  containerLocations: {
    A0: {
      ...mockFarmDefContainerLocations,
      name: 'A0',
      properties: { lane: 'A' },
      index: 1,
    },
    UTurn1: {
      ...mockFarmDefContainerLocations,
      name: 'UTurn1',
      properties: { lane: '-' },
      index: 2,
    },
    B0: {
      ...mockFarmDefContainerLocations,
      name: 'B0',
      properties: { lane: 'B' },
      index: 3,
    },
    UTurn2: {
      ...mockFarmDefContainerLocations,
      name: 'UTurn2',
      properties: { lane: '-' },
      index: 4,
    },
    C0: {
      ...mockFarmDefContainerLocations,
      name: 'C0',
      properties: { lane: 'C' },
      index: 5,
    },
  },
};

export const mockFarmDefTailLiftMachine: any = {
  name: 'TailTableLift',
  kind: 'machine',
  path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/TailTableLift',
  description: 'Lifts table to a Propagation Rack Level.',
  id: '22e6c43f-eb61-4c86-b3e6-ed9d24b51da2',
  displayName: 'Table Lift',
  class: 'TableLift',
  containerLocations: {
    LiftTable: {
      name: 'LiftTable',
      kind: 'containerLocation',
      path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/TailTableLift/containerLocations/LiftTable',
      ref: '22e6c43f-eb61-4c86-b3e6-ed9d24b51da2:containerLocation-LiftTable',
      class: 'TableIndex',
      parentId: '22e6c43f-eb61-4c86-b3e6-ed9d24b51da2',
      parentPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/TailTableLift',
      properties: {},
      containerTypes: ['Table'],
      index: 1,
      mappings: [],
    },
  },
};

export const mockFarmDefPropLevel1Machine: any = {
  name: 'PropLevel1',
  kind: 'machine',
  path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
  description: 'Propagation Rack Level.',
  id: '17f51ead-8685-4ea8-ae0f-44effde31cc9',
  displayName: 'Propagation Rack Level',
  class: 'PropRackLevel',
};

export const mockFarmDefPropLevel2Machine: any = {
  name: 'PropLevel2',
  kind: 'machine',
  path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
  description: 'Propagation Rack Level.',
  id: 'dab2e9d1-2600-420d-9bd7-542584dd48c5',
  displayName: 'Propagation Rack Level',
  class: 'PropRackLevel',
  generation: 'euphrates',
};

export const mockFarmDefPropLevel3Machine: any = {
  name: 'PropLevel3',
  kind: 'machine',
  path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3',
  description: 'Propagation Rack Level.',
  id: 'b619848c-36a5-4e70-8e6c-ddb800feca5e',
  displayName: 'Propagation Rack Level',
  class: 'PropRackLevel',
};

export const mockFarmDefLine: any = {
  name: 'GrowRoom',
  kind: 'line',
  path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom',
  id: '123-abc',
  displayName: 'GrowRoom',
  class: 'GrowRoom',
  generation: 'default',
  parentId: 'ab6e72fe-7d7c-4f2f-aa06-59d9afd2c0be',
  parentPath: 'sites/SSF2/areas/VerticalGrow',
  machines: {
    [mockFarmDefMachine.name]: mockFarmDefMachine,
  },
};

export const mockFarmDefLineWithUnsupportedMachine: any = {
  name: 'GrowRoom',
  kind: 'line',
  path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom',
  id: '123-abc',
  displayName: 'GrowRoom',
  class: 'GrowRoom',
  generation: 'default',
  parentId: 'ab6e72fe-7d7c-4f2f-aa06-59d9afd2c0be',
  parentPath: 'sites/SSF2/areas/VerticalGrow',
  machines: {
    UnsupportedMachine: {
      id: '123-abc',
      kind: 'line',
      displayName: 'UnsupportedMachine',
      class: 'UnsupportedMachine',
      path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/UnsupportedMachine',
      name: 'UnsupportedMachine',
      properties: {},
    },
  },
};
