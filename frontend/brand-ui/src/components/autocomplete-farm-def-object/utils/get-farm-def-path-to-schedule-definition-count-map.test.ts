import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getFarmDefPathToScheduleDefinitionCountMap } from '.';

describe('getFarmDefPathToScheduleDefinitionCountMap', () => {
  it('aggregates Schedule Definition counts  to parents', () => {
    const map = getFarmDefPathToScheduleDefinitionCountMap(root);

    expect(map.get('sites/SSF2/areas/Seeding')).toBe(2);
    expect(map.get('sites/SSF2')).toBe(2);
    expect(map.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(0);
    expect(map.get('sites/LAX1')).toBe(0);
  });

  it('aggregates Schedule Definition counts  to parents taking in account schedule definition compatibility', () => {
    const map = getFarmDefPathToScheduleDefinitionCountMap(
      root,
      root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalHumidity']
    );

    expect(map.get('sites/SSF2/areas/Seeding')).toBe(1);
    expect(map.get('sites/SSF2')).toBe(1);
    expect(map.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(0);
    expect(map.get('sites/LAX1')).toBe(0);
  });
});
