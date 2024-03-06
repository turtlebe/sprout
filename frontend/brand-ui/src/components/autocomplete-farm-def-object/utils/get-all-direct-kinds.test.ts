import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getAllDirectKinds } from '.';

describe('getAllDirectKinds', () => {
  it('returns the direct kinds for a given FarmDef Object', () => {
    expect(getAllDirectKinds(root.sites['SSF2'])).toEqual(['areas', 'farms']);
    expect(getAllDirectKinds(root.sites['SSF2'].areas['Seeding'])).toEqual(['lines']);
  });
});
