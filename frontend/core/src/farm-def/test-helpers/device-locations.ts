import { DeviceLocation } from '../types';

export const deviceLocation: DeviceLocation = {
  name: 'SprinkleGroup',
  kind: 'deviceLocation',
  path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/deviceLocations/SprinkleGroup',
  ref: '32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup',
  description: '',
  class: 'TestSprinkle',
  parentId: '32d60718-2753-4b35-b67c-58fcb88422e8',
  parentPath: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1',
  properties: {},
  deviceTypes: ['Sprinkle2FIR', 'Sprinkle2Base', 'Sprinkle2CO2'],
  mappings: [],
  interfaces: {},
  isGroup: false,
};

export const deviceLocationGroup: DeviceLocation = {
  ...deviceLocation,
  isGroup: true,
  locations: {
    SprinkleSp1p1: {
      name: 'SprinkleSp1p1',
      kind: 'childDeviceLocation',
      path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/deviceLocations/SprinkleGroup/locations/SprinkleSp1p1',
      description: 'SprinkleSp1p1 device location',
      ref: '32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup:SprinkleSp1p1',
      class: 'TestItem',
      parentRef: '32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup',
      parentPath: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/deviceLocations/SprinkleGroup',
      properties: {},
      mappings: [],
    },
  },
};
