import { Device } from '../types';
import { DeviceTypes } from '../types/device-types';

export function isSprinkle2Device(device: Device) {
  return [DeviceTypes.Sprinkle2Base, DeviceTypes.Sprinkle2CO2, DeviceTypes.Sprinkle2FIR]
    .map(e => e.toString())
    .includes(device?.deviceTypeName);
}
