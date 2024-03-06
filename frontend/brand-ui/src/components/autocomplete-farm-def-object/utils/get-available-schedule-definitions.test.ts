import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { getAvailableScheduleDefinitions } from '.';

describe('getAvailableScheduleDefinitions', () => {
  it('returns an array of all Schedule Definitions', () => {
    const result = getAvailableScheduleDefinitions(root);
    expect(result).toHaveLength(2);

    const scheduleDefinitions = result.map(scheduleDefinition => scheduleDefinition.path);
    expect(scheduleDefinitions).toContain('sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity');
    expect(scheduleDefinitions).toContain('sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalTemperature');
  });

  it('returns an array of all the compatible Schedule Definitions', () => {
    const result = getAvailableScheduleDefinitions(
      root,
      root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalHumidity']
    );
    expect(result).toHaveLength(1);

    const scheduleDefinitions = result.map(scheduleDefinition => scheduleDefinition.path);
    expect(scheduleDefinitions).toContain('sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity');
  });
});
