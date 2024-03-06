import { getShortenedPath } from './get-shortened-path';

describe('getShortenedPath', () => {
  it('returns shortened path with trailing slash', () => {
    expect(getShortenedPath('sites/SSF2', true)).toBe('SSF2/');
    expect(getShortenedPath('sites/SSF2/', true)).toBe('SSF2/');
  });

  it('returns shortened path without trailing slash', () => {
    expect(getShortenedPath('sites/SSF2/', false)).toBe('SSF2');
    expect(getShortenedPath('sites/SSF2', false)).toBe('SSF2');
    expect(getShortenedPath('sites/SSF2')).toBe('SSF2');
    expect(getShortenedPath('sites/SSF2/areas/Seeding', false)).toBe('SSF2/Seeding');
    expect(
      getShortenedPath(
        'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/LightPlane1AA/deviceLocations/SprinkleGroup/locations/SprinkleSp10p3',
        false
      )
    ).toBe('LAX1/VerticalGrow/GrowRoom1/LightPlane1AA/SprinkleGroup/SprinkleSp10p3');
  });
});
