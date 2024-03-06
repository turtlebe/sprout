import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { mockSchedules } from '@plentyag/core/src/test-helpers/mocks';

import { getGroupName } from '.';

const [schedule] = mockSchedules;

describe('getGroupName', () => {
  it('returns Device Location', () => {
    expect(getGroupName(root.sites['SSF2'].deviceLocations['Camera'])).toBe('Device Location');
  });

  it('returns Schedule Definition', () => {
    expect(getGroupName(root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalHumidity'])).toBe(
      'Schedule Definition'
    );
  });

  it('returns Schedule', () => {
    expect(getGroupName(schedule)).toBe('Schedule');
  });

  it('returns the titleCase', () => {
    expect(getGroupName(root.sites['SSF2'])).toBe('Site');
    expect(getGroupName(root.sites['SSF2'].areas['Seeding'])).toBe('Area');
  });
});
