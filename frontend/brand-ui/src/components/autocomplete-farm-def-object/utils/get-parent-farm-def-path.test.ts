import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getGrandParentFarmDefPath, getParentFarmDefPath } from '.';

describe('getParentFarmDefPath', () => {
  it('returns the parent path', () => {
    expect(getParentFarmDefPath('sites/SSF2')).toBe('');
    expect(getParentFarmDefPath('sites/SSF2/areas/BMP')).toBe('sites/SSF2');
    expect(getParentFarmDefPath('sites/SSF2/areas/BMP/lines/NorthBMP')).toBe('sites/SSF2/areas/BMP');
    expect(getParentFarmDefPath('sites/SSF2/areas/BMP/lines/NorthBMP')).toBe('sites/SSF2/areas/BMP');
    expect(getParentFarmDefPath(root.sites['SSF2'].areas['Seeding'])).toBe('sites/SSF2');
    expect(getParentFarmDefPath(root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'])).toBe(
      'sites/SSF2/areas/Seeding'
    );
  });
});

describe('getGrandParentFarmDefPath', () => {
  it('returns the grand parent path', () => {
    expect(getGrandParentFarmDefPath('sites/SSF2/areas/BMP')).toBe('');
    expect(getGrandParentFarmDefPath('sites/SSF2/areas/BMP/lines/NorthBMP')).toBe('sites/SSF2');
    expect(getGrandParentFarmDefPath('sites/SSF2/areas/BMP/lines/NorthBMP')).toBe('sites/SSF2');
    expect(getGrandParentFarmDefPath(root.sites['SSF2'].areas['Seeding'])).toBe('');
    expect(getGrandParentFarmDefPath(root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'])).toBe('sites/SSF2');
  });
});
