import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getAllChildObjects } from '.';

describe('getAllChildObjects', () => {
  it('returns an array FarmDefObject corresponding to the children of the object', () => {
    expect(getAllChildObjects(root)).toHaveLength(10);

    const paths = getAllChildObjects(root).map(farmDefObject => farmDefObject.path);
    expect(paths).toContain('sites/LAX1');
    expect(paths).toContain('sites/SSF2');
    expect(paths).toContain('sites/SSF2/areas/Seeding');
    expect(paths).toContain('sites/SSF2/areas/Seeding/lines/TraySeeding');
    expect(paths).toContain('sites/SSF2/areas/VerticalGrow');
    expect(paths).toContain('sites/SSF2/areas/VerticalGrow/lines/GrowRoom');
    expect(paths).toContain('sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1');
    expect(paths).toContain('sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/Nutrient2');
    expect(paths).toContain('sites/LAR1');
    expect(paths).toContain('sites/SSF2/farms/Tigris');
  });
});
