import { buildDmsDevice } from '../test-helpers/devices';
import { DeviceTypes } from '../types/device-types';

import { isSprinkle2Device } from '.';

describe('isSprinkles2Device', () => {
  it('returns true', () => {
    expect(isSprinkle2Device(buildDmsDevice({ deviceTypeName: DeviceTypes.Sprinkle2Base }))).toBe(true);
    expect(isSprinkle2Device(buildDmsDevice({ deviceTypeName: DeviceTypes.Sprinkle2CO2 }))).toBe(true);
    expect(isSprinkle2Device(buildDmsDevice({ deviceTypeName: DeviceTypes.Sprinkle2FIR }))).toBe(true);
  });

  it('returns false', () => {
    expect(isSprinkle2Device(buildDmsDevice({ deviceTypeName: null }))).toBe(false);
    expect(isSprinkle2Device(buildDmsDevice({ deviceTypeName: 'Hathor' }))).toBe(false);
  });
});
