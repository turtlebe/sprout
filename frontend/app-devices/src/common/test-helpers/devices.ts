import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { uuidv4 } from '@plentyag/core/src/utils';

import { Device, DmsDevice } from '../types';
import { DeviceState } from '../types/device-state';
import { isHathorDevice } from '../utils';

import { buildHathorInterface } from './interfaces';

export const mockDevices: Device[] = [
  {
    deviceTypeName: 'Sprinkle2FIR',
    id: 'aa8fb910-e1f0-4d69-8ba9-3c59614754df',
    kind: 'device',
    location: null,
    measurements: {},
    path: 'devices/aa8fb910-e1f0-4d69-8ba9-3c59614754df',
    properties: {
      interfaceType: 'RS485',
      resolution: '32x24',
    },
    serial: 'serial-Sprinkle2FIR',
  },
  {
    deviceTypeName: 'Sprinkle2FIR',
    id: 'f08a0d0c-8bdc-495e-aadf-8b8de974221d',
    kind: 'device',
    location: root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'].deviceLocations['Camera'],
    measurements: {},
    path: 'devices/f08a0d0c-8bdc-495e-aadf-8b8de974221d',
    properties: {
      interfaceType: 'RS485',
      resolution: '32x24',
    },
    serial: 'serial-unplaced-Sprinkle2FIR',
  },
  {
    deviceTypeName: 'BaslerACA308816gc',
    id: '4515f120-2a95-4955-bc07-ba4379b9a963',
    kind: 'device',
    location: root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'].deviceLocations['Camera3'],
    measurements: {},
    path: 'devices/4515f120-2a95-4955-bc07-ba4379b9a963',
    properties: {
      interfaceType: 'GigE',
      model: 'acA3088-16gc',
      objectTypes: ['RGB Image'],
      powerTypes: ['PoE', '12-24VDC'],
      resolution: '3088x2064',
      scanType: 'area',
      supplierName: 'BASLER',
    },
    serial: 'serial-BaslerACA308816gc',
  },
  {
    deviceTypeName: 'BaslerACA308816gc',
    id: 'c9f5628c-d8aa-4564-82a4-39b7e0b16e91',
    kind: 'device',
    location: null,
    measurements: {},
    path: 'devices/c9f5628c-d8aa-4564-82a4-39b7e0b16e91',
    properties: {
      interfaceType: 'GigE',
      model: 'acA3088-16gc',
      objectTypes: ['RGB Image'],
      powerTypes: ['PoE', '12-24VDC'],
      resolution: '3088x2064',
      scanType: 'area',
      supplierName: 'BASLER',
    },
    serial: 'serial-unplaced-BaslerACA308816gc',
  },
  {
    deviceTypeName: 'Hathor',
    id: '55459ba8-bd05-4f86-bb58-4eb0b9c5c0ad',
    kind: 'device',
    location: {
      class: 'Hathor',
      description: null,
      deviceTypes: ['Hathor'],
      interfaces: {
        Hathor: buildHathorInterface(
          'sites/TEST/areas/CPROC/lines/CentralProcessing/machines/Melmac/deviceLocations/TestHathor'
        ),
      },
      kind: 'deviceLocation',
      mappings: [],
      name: 'TestHathor',
      parentId: 'd2234567',
      parentPath: 'sites/TEST/areas/CPROC/lines/CentralProcessing/machines/Melmac',
      path: 'sites/TEST/areas/CPROC/lines/CentralProcessing/machines/Melmac/deviceLocations/TestHathor',
      placedAt: '2021-05-05T08:33:10.491916Z',
      placedDeviceId: '55459ba8-bd05-4f86-bb58-4eb0b9c5c0ad',
      properties: {},
      reactor: null,
      ref: 'd2234567:deviceLocation-TestHathor',
      isGroup: false,
    },
    measurements: {},
    path: 'devices/55459ba8-bd05-4f86-bb58-4eb0b9c5c0ad',
    properties: {},
    serial: 'HTR000X000',
  },
  {
    deviceTypeName: 'Hathor',
    id: 'cf2c3647-feef-4580-97be-09eb9461a24d',
    kind: 'device',
    location: {
      class: 'HathorLocation',
      description: null,
      deviceTypes: ['Hathor'],
      interfaces: {
        Hathor: buildHathorInterface(
          'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow1/deviceLocations/Hathor1'
        ),
      },
      kind: 'deviceLocation',
      mappings: [],
      name: 'Hathor1',
      parentId: '71d87dbc-ed2a-4bd5-a971-6c397e448231',
      parentPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow1',
      path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow1/deviceLocations/Hathor1',
      placedAt: '2021-05-18T12:25:03.822570Z',
      placedDeviceId: 'cf2c3647-feef-4580-97be-09eb9461a24d',
      properties: {},
      reactor: null,
      ref: '71d87dbc-ed2a-4bd5-a971-6c397e448231:deviceLocation-Hathor1',
      isGroup: false,
    },
    measurements: {},
    path: 'devices/cf2c3647-feef-4580-97be-09eb9461a24d',
    properties: {},
    serial: 'HTR000X014',
  },
  {
    deviceTypeName: 'Sprinkle',
    id: '426a74c2-a67e-4253-8e5a-aa56a5b7b65d',
    kind: 'device',
    location: {
      class: 'PropSprinkleLocation',
      description: 'Sprinkle parking spot, bay 1, light position 14',
      deviceTypes: ['Sprinkle'],
      interfaces: {},
      kind: 'deviceLocation',
      mappings: [
        {
          from: '3d6b895f-0939-4e45-b956-d47e8e989483:deviceLocation-SprinkleL1Bay1LP14',
          kind: 'mapping',
          to: '3d6b895f-0939-4e45-b956-d47e8e989483:containerLocation-Bay1',
          type: 'relates',
        },
      ],
      name: 'SprinkleL1Bay1LP14',
      parentId: '3d6b895f-0939-4e45-b956-d47e8e989483',
      parentPath: 'sites/SSF2/areas/Propagation/lines/PropagationRack/machines/PropLevel1',
      path: 'sites/SSF2/areas/Propagation/lines/PropagationRack/machines/PropLevel1/deviceLocations/SprinkleL1Bay1LP14',
      placedAt: '2021-07-09T03:14:10.083247Z',
      placedDeviceId: '426a74c2-a67e-4253-8e5a-aa56a5b7b65d',
      properties: {
        containerIndex: 1,
        lightPosition: 14,
      },
      reactor: null,
      ref: '3d6b895f-0939-4e45-b956-d47e8e989483:deviceLocation-SprinkleL1Bay1LP14',
      isGroup: false,
    },
    measurements: {},
    path: 'devices/426a74c2-a67e-4253-8e5a-aa56a5b7b65d',
    properties: {},
    serial: 'FC60B965AACE60C0',
  },
];

export const mockUnplacedDevices: Device[] = mockDevices.filter(device => !device.location);
export const mockPlacedDevices: Device[] = mockDevices.filter(device => device.location);
export const mockPlacedHathorDevices: Device[] = mockDevices.filter(
  device => device.location && isHathorDevice(device)
);

export const mockDmsDevice: DmsDevice = {
  ...mockDevices[0],
  deviceState: DeviceState.active,
  appFirmwareVersion: '0.0.0',
  bootloaderFirmwareVersion: '0.0.0',
  hasCertificate: true,
};

export interface BuildDeviceLocation {
  description?: string;
  device?: Device;
  deviceType?: Device['deviceTypeName'];
  name?: string;
  parentPath?: string;
}

export const buildDeviceLocation = ({
  description = 'description',
  device,
  deviceType = 'Hathor',
  name = 'Location1',
  parentPath = 'sites/LAX1',
}: BuildDeviceLocation): Device['location'] => {
  return {
    class: `${deviceType}Location`,
    description,
    deviceTypes: [deviceType],
    interfaces: {},
    isGroup: false,
    kind: 'deviceLocation',
    locations: {},
    mappings: [],
    name,
    parentId: uuidv4(),
    parentPath,
    path: `${parentPath}/deviceLocations/${name}`,
    placedAt: device ? '2023-01-01T00:00:00Z' : undefined,
    placedDeviceId: device?.id,
    properties: {},
    ref: `${uuidv4()}:deviceLocation-${name}`,
  };
};

export interface BuildmsDevice {
  deviceTypeName?: DmsDevice['deviceTypeName'];
  hasCertificate?: DmsDevice['hasCertificate'];
  location?: DmsDevice['location'];
  properties?: DmsDevice['properties'];
  withLocation?: boolean;
}

export const buildDmsDevice = ({
  deviceTypeName = 'Hathor',
  hasCertificate = true,
  location,
  properties = {},
  withLocation,
}: BuildmsDevice): DmsDevice => {
  const id = uuidv4();
  const device: DmsDevice = {
    id,
    kind: 'device',
    measurements: {},
    path: `devices/${id}`,
    properties,
    serial: 'HTR000X000',
    deviceState: DeviceState.active,
    appFirmwareVersion: '0.0.0',
    bootloaderFirmwareVersion: '0.0.0',
    hasCertificate,
    deviceTypeName,
    location: undefined,
  };

  const deviceLocation = withLocation ? buildDeviceLocation({ device, deviceType: device.deviceTypeName }) : location;

  return { ...device, location: deviceLocation };
};
