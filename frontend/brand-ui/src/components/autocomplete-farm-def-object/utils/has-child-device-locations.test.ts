import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { AutocompleteFarmDefObjectState, initialScopedState } from '../hooks/use-autocomplete-farm-def-object-store';

import { hasChildDeviceLocations } from './has-child-device-locations';

const growLane1 = root.sites['SSF2'].areas['VerticalGrow'].lines['GrowRoom'].machines['GrowLane1'];
const sprinkleSp1p1 = growLane1.deviceLocations['SprinkleGroup'].locations['SprinkleSp1p1'];
const deviceLocationCountMap = new Map<string, number>();
deviceLocationCountMap.set(growLane1.path, 2);

const state = { ...initialScopedState, deviceLocationCountMap } as unknown as AutocompleteFarmDefObjectState;

describe('hasChildDeviceLocations', () => {
  it('always return true when the object is a site despite the deviceLocationCountMap', () => {
    expect(hasChildDeviceLocations(root.sites['SSF2'], null)).toBe(true);
    expect(hasChildDeviceLocations(root.sites['LAR1'], state)).toBe(true);
  });

  it('returns true', () => {
    expect(hasChildDeviceLocations(growLane1, state)).toBe(true);
  });

  it('returns false', () => {
    expect(hasChildDeviceLocations(root.sites['SSF2'].areas['Seeding'], state)).toBe(false);
  });

  it('returns false for an invalid object', () => {
    expect(hasChildDeviceLocations(null, state)).toBe(false);
  });

  it('returns true when the object is a child device location', () => {
    expect(hasChildDeviceLocations(sprinkleSp1p1, state)).toBe(true);
  });

  it('returns true when the object is a child device location matching the given device type', () => {
    expect(
      hasChildDeviceLocations(
        { ...sprinkleSp1p1, properties: { ...sprinkleSp1p1.properties, deviceTypes: ['Sprinkle2FIR'] } },
        state,
        ['Sprinkle2FIR']
      )
    ).toBe(true);
  });

  it('returns false when the object is a child device location and does not match the given device type', () => {
    expect(
      hasChildDeviceLocations(
        { ...sprinkleSp1p1, properties: { ...sprinkleSp1p1.properties, deviceTypes: ['Sprinkle2FIR'] } },
        state,
        ['BaslerACA308816gc']
      )
    ).toBe(false);
  });
});
