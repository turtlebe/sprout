import { isTigrisIncluded } from '.';

const tigrisFarmDef = 'sites/SSF2/farms/Tigris';
const taurusFarmDef = 'sites/SSF2/farms/Taurus';

describe('isTigrisIncluded', () => {
  it('returns true', () => {
    expect(isTigrisIncluded([taurusFarmDef, tigrisFarmDef])).toBe(true);
    expect(isTigrisIncluded([tigrisFarmDef])).toBe(true);
  });

  it('returns false', () => {
    expect(isTigrisIncluded([])).toBe(false);
    expect(isTigrisIncluded([taurusFarmDef])).toBe(false);
  });
});
