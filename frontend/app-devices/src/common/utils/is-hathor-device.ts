import { Device } from '../types';
import { DeviceTypes } from '../types/device-types';

export function isHathorDevice(device: Device) {
  return DeviceTypes.Hathor === device?.deviceTypeName;
}
