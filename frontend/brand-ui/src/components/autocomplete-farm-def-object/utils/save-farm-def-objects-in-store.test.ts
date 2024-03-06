import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { AutocompleteFarmDefObjectActions } from '../hooks';

import { saveFarmDefObjectsInStore } from '.';

describe('saveFarmDefObjectsInStore', () => {
  it('saves farmDef objects, deviceLocations, containerLocations, scheduleDefinitions, and a map to the store', () => {
    const actions = {
      addFarmDefSiteWithChildren: jest.fn(),
      addFarmDefObjects: jest.fn().mockImplementation(farmDefObjects => {
        expect(farmDefObjects.length).toBeGreaterThan(0);
        const kinds = new Set(farmDefObjects.map(o => o.kind));
        expect(kinds).toContain('deviceLocation');
        expect(kinds).toContain('childDeviceLocation');
        expect(kinds).toContain('containerLocation');
        expect(kinds).toContain('scheduleDefinition');
      }),
    } as unknown as AutocompleteFarmDefObjectActions;

    saveFarmDefObjectsInStore(root.sites['SSF2'], actions);

    expect(actions.addFarmDefObjects).toHaveBeenCalled();
    expect(actions.addFarmDefSiteWithChildren).toHaveBeenCalledWith(root.sites['SSF2']);
  });
});
