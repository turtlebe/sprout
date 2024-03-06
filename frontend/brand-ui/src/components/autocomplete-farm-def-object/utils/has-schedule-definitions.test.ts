import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { AutocompleteFarmDefObjectState, initialScopedState } from '../hooks/use-autocomplete-farm-def-object-store';

import { hasScheduleDefinitions } from '.';

const scheduleDefinitionCountMap = new Map<string, number>();
scheduleDefinitionCountMap.set(root.sites['SSF2'].areas['Seeding'].path, 2);
scheduleDefinitionCountMap.set(root.sites['LAR1'].path, 0);

const state = { ...initialScopedState, scheduleDefinitionCountMap } as unknown as AutocompleteFarmDefObjectState;

describe('hasScheduleDefinitions', () => {
  it('always return true when the object is a site despite the scheduleDefinitionCountMap', () => {
    expect(hasScheduleDefinitions(root.sites['SSF2'], null)).toBe(true);
    expect(hasScheduleDefinitions(root.sites['LAR1'], state)).toBe(true);
  });

  it('returns true', () => {
    expect(hasScheduleDefinitions(root.sites['SSF2'].areas['Seeding'], state)).toBe(true);
  });

  it('returns false', () => {
    expect(hasScheduleDefinitions(root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'], state)).toBe(false);
  });

  it('returns false for an invalid object', () => {
    expect(hasScheduleDefinitions(null, state)).toBe(false);
  });

  it('returns true when the object is a ScheduleDefinition', () => {
    expect(
      hasScheduleDefinitions(root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalHumidity'], state)
    ).toBe(true);
  });
});
