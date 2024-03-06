import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { deviceLocation, deviceLocationGroup } from '@plentyag/core/src/farm-def/test-helpers';

import { getShortenedPathFromObject } from '.';

describe('getShortenedPathFromObject', () => {
  it('returns a shorter version of the path without the types', () => {
    expect(getShortenedPathFromObject(root.sites['SSF2'])).toBe('SSF2/');
    expect(getShortenedPathFromObject(root.sites['SSF2'].areas['Seeding'])).toBe('SSF2/Seeding/');
  });

  it('returns a shorter version of the path for a Device Location', () => {
    expect(getShortenedPathFromObject(deviceLocation)).toBe('SSF2/VerticalGrow/GrowRoom/GrowLane1/SprinkleGroup/');
  });

  it('returns a shorter version of the path for a Group Device Location with one Child Device Location', () => {
    expect(getShortenedPathFromObject(deviceLocationGroup)).toBe(
      'SSF2/VerticalGrow/GrowRoom/GrowLane1/SprinkleGroup/SprinkleSp1p1/'
    );
  });
});
