import { Device } from '../types';
import { DeviceTypes } from '../types/device-types';

export function isSprinkleDevice(device: Device) {
  return DeviceTypes.Sprinkle === device?.deviceTypeName;
}
