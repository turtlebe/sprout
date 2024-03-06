import { Device } from '../types';
import { DeviceTypes } from '../types/device-types';

import { isHathorDevice } from '.';

function buildDevice(deviceTypeName: any): Device {
  const device = { deviceTypeName };

  return device as unknown as Device;
}
describe('isSprinkles2Device', () => {
  it('returns true', () => {
    expect(isHathorDevice(buildDevice(DeviceTypes.Hathor))).toBe(true);
  });

  it('returns false', () => {
    expect(isHathorDevice(undefined)).toBe(false);
    expect(isHathorDevice(null)).toBe(false);
    expect(isHathorDevice(buildDevice(''))).toBe(false);
    expect(isHathorDevice(buildDevice(undefined))).toBe(false);
    expect(isHathorDevice(buildDevice('SomethingElse'))).toBe(false);
  });
});
