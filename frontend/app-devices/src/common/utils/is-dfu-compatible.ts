import { Device, DmsDevice } from '../types';
import { isDmsDevice } from '../types/type-guards';

import { isHathorDevice } from './is-hathor-device';

export const allowedDeviceTypes = ['Hathor', 'Sprinkle2Base', 'Sprinkle2FIR', 'Sprinkle2CO2'];

export function isDfuCompatible(device: Device | DmsDevice) {
  if (isDmsDevice(device) && isHathorDevice(device)) {
    return device.hasCertificate;
  }

  return allowedDeviceTypes.includes(device?.deviceTypeName);
}
