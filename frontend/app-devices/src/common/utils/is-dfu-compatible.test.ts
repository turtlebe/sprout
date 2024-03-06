import { buildDmsDevice } from '../test-helpers/devices';
import { Device } from '../types';

import { isDfuCompatible } from './is-dfu-compatible';

describe('isDfuCompatible', () => {
  it('returns true for a hathor with certificate', () => {
    const device = buildDmsDevice({ deviceTypeName: 'Hathor', hasCertificate: true });

    expect(isDfuCompatible(device)).toBe(true);
  });

  it('returns false for a hathor without certificate', () => {
    const device = buildDmsDevice({ deviceTypeName: 'Hathor', hasCertificate: false });

    expect(isDfuCompatible(device)).toBe(false);
  });

  it.each(['Sprinkle2Base', 'Sprinkle2FIR', 'Sprinkle2CO2'])(
    'returns true for %s',
    (deviceTypeName: Device['deviceTypeName']) => {
      const device = buildDmsDevice({ deviceTypeName, hasCertificate: false });

      expect(isDfuCompatible(device)).toBe(true);
    }
  );

  it.each(['Coco', 'CHLOe', 'LuminaireWalalight', 'LuminaireEuphoria'])(
    'returns false for %s',
    (deviceTypeName: Device['deviceTypeName']) => {
      const device = buildDmsDevice({ deviceTypeName, hasCertificate: false });

      expect(isDfuCompatible(device)).toBe(false);
    }
  );
});
