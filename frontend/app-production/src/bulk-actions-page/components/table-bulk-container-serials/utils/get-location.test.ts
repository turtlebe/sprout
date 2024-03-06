import { getLocation } from './get-location';

describe('getLocation', () => {
  it('returns machine location in format: site/area/line', () => {
    expect(
      getLocation({
        machine: {
          siteName: 'SSF2',
          areaName: 'VerticalGrow',
          lineName: 'Line1',
          farmdefMachineId: 'xyz',
          traceabilityMachineId: '123',
        },
      })
    ).toBe('SSF2/VerticalGrow/Line1');
  });

  it('returns undefined if location is not provided', () => {
    expect(getLocation(undefined)).toBe(undefined);
  });

  it('returns undefined if machine is not provided', () => {
    // @ts-ignore
    const location: ProdResources.Location = {};
    expect(getLocation(location)).toBe(undefined);
  });
});
