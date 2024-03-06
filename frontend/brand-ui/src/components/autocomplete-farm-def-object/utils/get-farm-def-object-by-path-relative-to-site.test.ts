import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getFarmDefObjectByPathRelativeToSite } from '.';

const ssf2 = root.sites['SSF2'];

describe('getFarmDefObjectByPathRelativeToSite', () => {
  it('returns a FarmDefObject from its site by path', () => {
    expect(getFarmDefObjectByPathRelativeToSite(ssf2, 'sites/SSF2/areas/Seeding/lines/TraySeeding')).toHaveProperty(
      'kind',
      'line'
    );
  });

  it('returns a FarmDefObject from its site by path', () => {
    expect(getFarmDefObjectByPathRelativeToSite(ssf2, 'sites/SSF2')).toHaveProperty('kind', 'site');
  });

  it('resolves to the closest valid ancestor', () => {
    expect(getFarmDefObjectByPathRelativeToSite(ssf2, 'sites/SSF2/areas/Seeding/lines/Tray')).toHaveProperty(
      'kind',
      'area'
    );
    expect(getFarmDefObjectByPathRelativeToSite(ssf2, 'sites/SSF2/areas/Seed/lines/Tray')).toHaveProperty(
      'kind',
      'site'
    );
  });

  it('returns undefined', () => {
    expect(getFarmDefObjectByPathRelativeToSite(ssf2, 'invalid-path')).toBeNull();
  });
});
