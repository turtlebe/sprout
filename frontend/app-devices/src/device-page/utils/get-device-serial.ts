import { Device } from '@plentyag/app-devices/src/common/types';

export function getDeviceSerial(device: Device): string {
  if (device?.serial && device?.properties?.deviceAddress) {
    return `${device.serial} (${device.properties.deviceAddress})`;
  }

  if (device?.serial) {
    return device.serial;
  }

  return '--';
}
