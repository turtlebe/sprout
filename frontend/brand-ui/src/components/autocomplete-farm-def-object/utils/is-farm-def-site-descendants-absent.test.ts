import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { AutocompleteFarmDefObjectState } from '../hooks';

import { isFarmDefSiteDescendantsAbsent } from '.';

describe('isFarmDefSiteDescendantsAbsent', () => {
  it('returns false', () => {
    const state = { farmDefObjects: [] } as unknown as AutocompleteFarmDefObjectState;
    expect(isFarmDefSiteDescendantsAbsent(root.sites['SSF2'], state)).toBe(true);
  });

  it('returns false', () => {
    const state = {
      farmDefObjects: [root.sites['SSF2'].areas['Seeding']],
    } as unknown as AutocompleteFarmDefObjectState;
    expect(isFarmDefSiteDescendantsAbsent(root.sites['LAX1'], state)).toBe(true);
    expect(isFarmDefSiteDescendantsAbsent(root.sites['LAR1'], state)).toBe(true);
  });

  it('returns true', () => {
    const state = {
      farmDefObjects: [root.sites['SSF2'].areas['Seeding']],
    } as unknown as AutocompleteFarmDefObjectState;
    expect(isFarmDefSiteDescendantsAbsent(root.sites['SSF2'], state)).toBe(false);
  });
});
