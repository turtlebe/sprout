import { Device } from './device';
import { DmsDevice } from './dms-device';

export function isDmsDevice(device: DmsDevice | Device): device is DmsDevice {
  return device && device.hasOwnProperty('deviceState');
}
