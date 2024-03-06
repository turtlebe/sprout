import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';

import { getDeviceSerial } from './get-device-serial';

const [device] = mockDevices;

describe('getDeviceSerial', () => {
  it('renders "--"', () => {
    expect(getDeviceSerial(undefined)).toBe('--');
  });

  it('renders the serial and the friendly serial', () => {
    const deviceSerial = getDeviceSerial({ ...device, properties: { deviceAddress: 'ABC' } });

    expect(deviceSerial).toContain(device.serial);
    expect(deviceSerial).toContain('ABC');
  });

  it('renders the serial only', () => {
    expect(getDeviceSerial(device)).toBe(device.serial);
  });
});
