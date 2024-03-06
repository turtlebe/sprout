import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getLastPathSegment } from '.';

describe('getLastPathSegment', () => {
  it('returns the last segment of the path', () => {
    expect(getLastPathSegment(root.sites['SSF2'])).toBe('SSF2');
    expect(getLastPathSegment(root.sites['SSF2'].areas['Seeding'])).toBe('Seeding');
  });
});
