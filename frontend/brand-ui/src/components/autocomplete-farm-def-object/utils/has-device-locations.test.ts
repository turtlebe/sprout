import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { AutocompleteFarmDefObjectState, initialScopedState } from '../hooks/use-autocomplete-farm-def-object-store';

import { hasDeviceLocations } from '.';

const camera = root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'].deviceLocations['Camera'];
const deviceLocationCountMap = new Map<string, number>();
deviceLocationCountMap.set(root.sites['SSF2'].areas['Seeding'].path, 1);
deviceLocationCountMap.set(root.sites['LAR1'].path, 0);

const state = { ...initialScopedState, deviceLocationCountMap } as unknown as AutocompleteFarmDefObjectState;

describe('hasDeviceLocations', () => {
  it('always return true when the object is a site despite the deviceLocationCountMap', () => {
    expect(hasDeviceLocations(root.sites['SSF2'], null)).toBe(true);
    expect(hasDeviceLocations(root.sites['LAR1'], state)).toBe(true);
  });

  it('returns true', () => {
    expect(hasDeviceLocations(root.sites['SSF2'].areas['Seeding'], state)).toBe(true);
  });

  it('returns false', () => {
    expect(hasDeviceLocations(root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'], state)).toBe(false);
  });

  it('returns false for an invalid object', () => {
    expect(hasDeviceLocations(null, state)).toBe(false);
  });

  it('returns true when the object is a device location', () => {
    expect(hasDeviceLocations(camera, state)).toBe(true);
  });

  it('returns false when the object is a group device location', () => {
    expect(hasDeviceLocations({ ...camera, isGroup: true }, state)).toBe(false);
  });

  it('returns true when the object is a device location matching the given device type', () => {
    expect(hasDeviceLocations(camera, state, ['BaslerACA402429uc'])).toBe(true);
  });

  it('returns false when the object is a device location and does not match the given device type', () => {
    expect(hasDeviceLocations(camera, state, ['BaslerACA308816gc'])).toBe(false);
  });
});
