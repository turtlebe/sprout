import { buildDmsDevice } from '../test-helpers/devices';
import { DeviceTypes } from '../types/device-types';

import { isSprinkleDevice } from '.';

describe('isSprinkleDevice', () => {
  it('returns true', () => {
    expect(isSprinkleDevice(buildDmsDevice({ deviceTypeName: DeviceTypes.Sprinkle }))).toBe(true);
  });

  it('returns false', () => {
    expect(isSprinkleDevice(buildDmsDevice({ deviceTypeName: null }))).toBe(false);
    expect(isSprinkleDevice(buildDmsDevice({ deviceTypeName: DeviceTypes.Hathor }))).toBe(false);
  });
});
