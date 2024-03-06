import { DeviceType } from '../types';

export const mockDeviceTypeBaslerACA308816gc: DeviceType = {
  name: 'BaslerACA308816gc',
  path: 'deviceTypes/BaslerACA308816gc',
  description: 'BASLER area scan color camera',
  kind: 'deviceType',
  properties: {
    interfaceType: 'GigE',
    model: 'acA3088-16gc',
    objectTypes: ['RGB Image'],
    powerTypes: ['PoE', '12-24VDC'],
    resolution: '3088x2064',
    scanType: 'area',
    supplierName: 'BASLER',
  },
  measurementDefinitions: {},
  methodDescriptors: {},
};

export const mockDeviceTypeSprinkle: DeviceType = {
  name: 'Sprinkle',
  path: 'deviceTypes/Sprinkle',
  description: 'Plenty IoT device for measuring ambient temperature and relative humidity',
  kind: 'deviceType',
  properties: {},
  measurementDefinitions: {
    RH: {
      name: 'RH',
      description: 'Ambient air relative humidity',
      kind: 'measurementDefinition',
      typeName: 'RelativeHumidity',
      reportedUnits: '%',
      isDerived: false,
    },
    Temp: {
      name: 'Temp',
      description: 'Ambient air temperature',
      kind: 'measurementDefinition',
      typeName: 'Temperature',
      reportedUnits: 'C',
      isDerived: false,
    },
  },
  methodDescriptors: {},
};

export const mockDeviceTypeHathor: DeviceType = {
  name: 'Hathor',
  path: 'deviceTypes/Hathor',
  description: 'Light actuation device',
  kind: 'deviceType',
  properties: {},
  measurementDefinitions: {},
  methodDescriptors: {
    TurnLights: {
      description: 'Lights On/Off',
      name: 'TurnLights',
      protoPackage: 'plenty.farmos.api.rpc.swiftriver.testhathor',
      protocol: {
        mqtt: {
          qos: 0,
          version: 0,
        },
      },
      type: 'trigger',
    },
  },
};

export const mockDeviceTypes: DeviceType[] = [
  mockDeviceTypeBaslerACA308816gc,
  mockDeviceTypeSprinkle,
  mockDeviceTypeHathor,
];
