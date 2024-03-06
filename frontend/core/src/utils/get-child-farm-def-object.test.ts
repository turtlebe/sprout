import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getChildFarmDefObject } from './get-child-farm-def-object';

const ssf2 = root.sites['SSF2'];
describe('getChildFarmDefObject', () => {
  it('returns null when the parentObject is invalid', () => {
    expect(getChildFarmDefObject(null, 'areas/VerticalGrow')).toBe(undefined);
    expect(getChildFarmDefObject(undefined, 'areas/VerticalGrow')).toBe(undefined);
  });

  it('returns null when the path is invalid', () => {
    expect(getChildFarmDefObject(ssf2, null)).toBe(undefined);
    expect(getChildFarmDefObject(ssf2, undefined)).toBe(undefined);
    expect(getChildFarmDefObject(ssf2, '')).toBe(undefined);
    expect(getChildFarmDefObject(ssf2, 'invalid/path')).toBe(undefined);
    expect(getChildFarmDefObject(ssf2, 'sites/LAX1/areas/Propagation')).toBe(undefined);
    expect(getChildFarmDefObject(ssf2, 'areas/Propagation')).toBe(undefined);
  });

  it('returns the child object given an absolute path', () => {
    expect(getChildFarmDefObject(ssf2, 'sites/SSF2/areas/VerticalGrow')).toBe(ssf2.areas['VerticalGrow']);
  });

  it('returns the child object given a relative path', () => {
    expect(getChildFarmDefObject(ssf2, 'areas/VerticalGrow')).toBe(ssf2.areas['VerticalGrow']);
  });

  it('returns the schedule definition from the parent object', () => {
    const seeding = ssf2.areas['Seeding'];
    const thermalHumidity = seeding.scheduleDefinitions['ThermalHumidity'];

    expect(getChildFarmDefObject(ssf2, 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity')).toBe(
      thermalHumidity
    );
    expect(getChildFarmDefObject(seeding, 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity')).toBe(
      thermalHumidity
    );
    expect(getChildFarmDefObject(seeding, 'scheduleDefinitions/ThermalHumidity')).toBe(thermalHumidity);
  });
});
