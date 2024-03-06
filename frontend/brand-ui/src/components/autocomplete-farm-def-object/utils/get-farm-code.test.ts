import { DeviceLocation, FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { getFarmCode } from '.';

const mockFarmDefObjects: FarmDefObject[] = [
  {
    id: '123',
    kind: 'site',
    path: 'sites/SSF2',
    name: 'SSF2',
    properties: {},
  },
  {
    id: '1234',
    kind: 'area',
    path: 'sites/SSF2/areas/VerticalGrow',
    name: 'VerticalGrow',
    properties: { farmCode: 'Tigris' },
  },
  {
    id: '12345',
    kind: 'line',
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom',
    name: 'VerticalGrow',
    properties: {},
  },
  {
    id: '123456',
    kind: 'machine',
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLine1',
    name: 'GrowLine1',
    properties: {},
  },
  {
    id: '1234567',
    kind: 'area',
    path: 'sites/SSF2/areas/BMP',
    name: 'BMP',
    properties: {},
  },
];

describe('getFarmCode', () => {
  it('returns undefined since device object is not a farm def object', () => {
    const mockDeviceObj: DeviceLocation = {
      ref: 'xyz',
      description: 'mock device',
      kind: 'deviceLocation',
      name: 'device1',
      path: '',
      class: '',
      mappings: [],
      parentId: '',
      interfaces: {},
      parentPath: '',
      properties: {},
      deviceTypes: [],
      placedDeviceId: '',
      isGroup: false,
    };
    expect(getFarmCode(mockDeviceObj, mockFarmDefObjects)).toBeUndefined();
  });

  it('returns farmCode from farmDefObj', () => {
    const farmDefObj = mockFarmDefObjects[1];
    expect(getFarmCode(farmDefObj, mockFarmDefObjects)).toBe('Tigris');
  });

  it('returns farmCode from parent of farmDefObj', () => {
    const farmDefObj = mockFarmDefObjects[2];
    expect(getFarmCode(farmDefObj, mockFarmDefObjects)).toBe('Tigris');
  });

  it('returns farmCode from grand parent of farmDefObj', () => {
    const farmDefObj = mockFarmDefObjects[3];
    expect(getFarmCode(farmDefObj, mockFarmDefObjects)).toBe('Tigris');
  });

  it('returns undefined when neither farmDefObj nor parent contains farmCode', () => {
    const farmDefObj = mockFarmDefObjects[4];
    expect(getFarmCode(farmDefObj, mockFarmDefObjects)).toBeUndefined();
  });
});
