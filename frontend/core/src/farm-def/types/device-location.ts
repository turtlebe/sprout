import { FarmDefInterface } from '.';

export interface ChildDeviceLocation {
  name: string;
  kind: 'childDeviceLocation';
  path: string;
  description: string;
  ref: string;
  class: string;
  parentRef: string;
  parentPath: string;
  properties: { deviceTypes?: string[] } & {};
  mappings: any[];
  placedDeviceId?: string;
  placedAt?: string;
}

export interface DeviceLocation {
  ref: string;
  description: string;
  kind: 'deviceLocation';
  name: string;
  path: string;
  class: string;
  mappings: any[];
  parentId: string;
  interfaces: { [key: string]: FarmDefInterface };
  parentPath: string;
  properties?: {};
  deviceTypes: string[];
  placedDeviceId?: string;
  placedAt?: string;
  reactor?: any;
  isGroup: boolean;
  locations?: { [key: string]: ChildDeviceLocation };
}
