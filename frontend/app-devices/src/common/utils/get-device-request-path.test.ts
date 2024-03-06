import { mockPlacedHathorDevices, mockUnplacedDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';

import { getDeviceRequestPath } from '.';

const hathor = mockPlacedHathorDevices[0];

describe('getDeviceRequestPath', () => {
  it('returns undefined when the device is unplaced', () => {
    expect(getDeviceRequestPath(mockUnplacedDevices[0], 'Hathor', 'CommandDevice')).toBeUndefined();
  });

  it('returns undefined for an invalid inteface name', () => {
    expect(getDeviceRequestPath(hathor, 'Invalid', 'CommandDevice')).toBeUndefined();
  });

  it('returns undefined for an invalid method name', () => {
    expect(getDeviceRequestPath(hathor, 'Hathor', 'Invalid')).toBeUndefined();
  });

  it('returns the path of the method', () => {
    expect(getDeviceRequestPath(hathor, 'Hathor', 'CommandDevice')).toEqual(
      hathor.location.interfaces.Hathor.methods.CommandDevice.path
    );
  });
});
