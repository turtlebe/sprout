import { Device } from '../../common/types';
import { DeviceTypes } from '../../common/types/device-types';

import { getAssociatedHathor } from '.';

const sprinkle2CO2 = { deviceTypeName: DeviceTypes.Sprinkle2CO2 } as Device;
const hathor = { deviceTypeName: DeviceTypes.Hathor } as Device;

describe('getAssociatedHathor', () => {
  it('returns undefined', () => {
    expect(getAssociatedHathor(null)).toBeUndefined();
    expect(getAssociatedHathor(undefined)).toBeUndefined();
    expect(getAssociatedHathor([])).toBeUndefined();
    expect(getAssociatedHathor([sprinkle2CO2])).toBeUndefined();
  });

  it('returns the first Hathor device', () => {
    expect(getAssociatedHathor([hathor])).toEqual(hathor);
    expect(getAssociatedHathor([sprinkle2CO2, hathor])).toEqual(hathor);
  });
});
