import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getFarmDefPathToDeviceLocationCountMap } from '.';

describe('getFarmDefPathToDeviceLocationCountMap', () => {
  it('aggregates device location numbers to parents', () => {
    const map = getFarmDefPathToDeviceLocationCountMap(root);

    expect(map.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(2);
    expect(map.get('sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1')).toBe(2);
    expect(map.get('sites/SSF2')).toBe(5);
  });

  it('aggregates device location numbers to parents for certain device types', () => {
    const map = getFarmDefPathToDeviceLocationCountMap(root, ['BaslerACA402429uc']);

    expect(map.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(1);
    expect(map.get('sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1')).toBe(0);
    expect(map.get('sites/SSF2')).toBe(2);
  });
});
