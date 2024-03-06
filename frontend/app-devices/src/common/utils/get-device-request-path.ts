import { Device } from '@plentyag/app-devices/src/common/types';

export function getDeviceRequestPath(device: Device, interfaceName: string, methodName: string): string {
  return device?.location?.interfaces?.[interfaceName]?.methods?.[methodName]?.path;
}
