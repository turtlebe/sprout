import { getParamsFromFarmDefPath } from '.';

describe('getParamsFromFarmDefPath', () => {
  it('should return an object of params from a given farm def path', () => {
    const path = 'sites/SSF2/farms/Tigris';
    const result = getParamsFromFarmDefPath(path);
    expect(result).toEqual({
      farmName: 'Tigris',
      farmsNamespace: 'farms',
      siteName: 'SSF2',
      sitesNamespace: 'sites',
    });
  });
});
