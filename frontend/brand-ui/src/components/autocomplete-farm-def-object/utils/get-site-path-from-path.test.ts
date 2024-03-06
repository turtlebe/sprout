import { getSitePathFromPath } from './get-site-path-from-path';

describe('getSitePathFromPath', () => {
  it('returns itself for an invalid path', () => {
    expect(getSitePathFromPath('sites')).toBe('sites');
    expect(getSitePathFromPath('')).toBe('');
  });

  it('returns the root of the path', () => {
    expect(getSitePathFromPath('sites/SSF2/areas/BMP')).toBe('sites/SSF2');
    expect(getSitePathFromPath('sites/SSF2/areas/BMP/lines/GrowLine1')).toBe('sites/SSF2');
    expect(getSitePathFromPath('sites/SSF2')).toBe('sites/SSF2');
  });
});
