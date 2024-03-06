import { isFarmDefSitePath } from '.';

describe('isFarmDefSitePath', () => {
  it('returns true', () => {
    expect(isFarmDefSitePath('sites/SSF2')).toBe(true);
  });

  it('returns false', () => {
    expect(isFarmDefSitePath(null)).toBe(false);
    expect(isFarmDefSitePath(undefined)).toBe(false);
    expect(isFarmDefSitePath('')).toBe(false);
    expect(isFarmDefSitePath('sites/SSF2/areas/BMP')).toBe(false);
  });
});
