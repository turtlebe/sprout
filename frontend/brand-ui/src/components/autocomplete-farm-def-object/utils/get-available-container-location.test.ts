import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getAvailableContainerLocations } from '.';

describe('getAvailableContainerLocations', () => {
  it('returns an array of all container locations', () => {
    expect(getAvailableContainerLocations(root)).toHaveLength(2);

    const containerLocationPaths = getAvailableContainerLocations(root).map(
      containerLocation => containerLocation.path
    );
    expect(containerLocationPaths).toContain(
      'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/containerLocations/T1'
    );
    expect(containerLocationPaths).toContain(
      'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/containerLocations/T2'
    );
  });
});
