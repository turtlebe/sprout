import { getShortenedPathWithoutSiteAndArea } from '.';

describe('removeSiteAreaFromPath', () => {
  it('gets the shortened path without site and area ', () => {
    const farmDefPath = 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3';
    const result = getShortenedPathWithoutSiteAndArea(farmDefPath);
    expect(result).toEqual('PropagationRack1/PropLevel3');
  });

  it('returns given path when does not start with site and area', () => {
    const farmDefPath = 'lines/PropagationRack1/machines/PropLevel3';
    const result = getShortenedPathWithoutSiteAndArea(farmDefPath);
    expect(result).toEqual(farmDefPath);
  });
});
