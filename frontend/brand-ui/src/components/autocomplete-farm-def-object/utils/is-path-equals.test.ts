import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { isPathEquals } from '.';

describe('isPathEquals', () => {
  it('returns true', () => {
    expect(isPathEquals('sites/SSF2')(root.sites['SSF2'])).toBe(true);
    expect(isPathEquals('sites/SSF2/areas/Seeding')(root.sites['SSF2'].areas['Seeding'])).toBe(true);
    expect(isPathEquals(root.sites['SSF2'])(root.sites['SSF2'])).toBe(true);
    expect(isPathEquals(root.sites['SSF2'].areas['Seeding'])(root.sites['SSF2'].areas['Seeding'])).toBe(true);
  });

  it('returns false', () => {
    expect(isPathEquals('sites/LAR1')(root.sites['SSF2'])).toBe(false);
    expect(isPathEquals('sites/SSF2/areas/BMP')(root.sites['SSF2'].areas['Seeding'])).toBe(false);
    expect(isPathEquals(root.sites['LAR1'])(root.sites['SSF2'])).toBe(false);
  });

  describe('with caseSensitive: false', () => {
    const option = { caseSensitive: false };

    it('returns true', () => {
      expect(isPathEquals('sites/ssf2', option)(root.sites['SSF2'])).toBe(true);
      expect(isPathEquals('sites/ssf2/areas/seeding', option)(root.sites['SSF2'].areas['Seeding'])).toBe(true);
      expect(isPathEquals(root.sites['SSF2'].path.toLowerCase(), option)(root.sites['SSF2'])).toBe(true);
      expect(
        isPathEquals(
          root.sites['SSF2'].areas['Seeding'].path.toLowerCase(),
          option
        )(root.sites['SSF2'].areas['Seeding'])
      ).toBe(true);
    });

    it('returns false', () => {
      expect(isPathEquals('sites/LAR1', option)(root.sites['SSF2'])).toBe(false);
      expect(isPathEquals('sites/SSF2/areas/BMP', option)(root.sites['SSF2'].areas['Seeding'])).toBe(false);
      expect(isPathEquals(root.sites['LAR1'], option)(root.sites['SSF2'])).toBe(false);
    });
  });
});
