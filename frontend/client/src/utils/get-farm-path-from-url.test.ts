import { getFarmPathFromUrl } from '.';

describe('getFarmPathFromUrl', () => {
  it('has no farm path', () => {
    expect(getFarmPathFromUrl('production/sites/LAX1/farms/LAX1')).toBe(undefined);
    expect(getFarmPathFromUrl('/production/site/LAX1/farms/LAX1')).toBe(undefined);
    expect(getFarmPathFromUrl('/production/sites/LAX1/farm/LAX1')).toBe(undefined);
    expect(getFarmPathFromUrl('/production/sites/farms/LAX1')).toBe(undefined);
  });

  it('has farm path', () => {
    const expectFarmPath = 'sites/SSF2/farms/Tigris';
    expect(getFarmPathFromUrl('/anything/sites/SSF2/farms/Tigris')).toBe(expectFarmPath);
    expect(getFarmPathFromUrl('/anything/sites/SSF2/farms/Tigris/more/anything')).toBe(expectFarmPath);
  });
});
