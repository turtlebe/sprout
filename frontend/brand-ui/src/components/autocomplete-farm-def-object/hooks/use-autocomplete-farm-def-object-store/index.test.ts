import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { mockSchedules } from '@plentyag/core/src/test-helpers/mocks/environment';
import { ScheduleType } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { initialScopedState, useAutocompleteFarmDefObjectStore } from '.';

const site = root.sites['SSF2'];
const area = root.sites['SSF2'].areas['Seeding'];
const line = root.sites['SSF2'].areas['Seeding'].lines['TraySeeding'];
const deviceLocationUnderSite = root.sites['SSF2'].deviceLocations['Camera'];
const deviceLocationUnderLine = line.deviceLocations['Camera'];
const containerLocationUnderGrowRoom =
  root.sites['SSF2'].areas['VerticalGrow'].lines['GrowRoom'].machines['GrowLane1'].containerLocations['T1'];

describe('useAutocompleteFarmDefObjectStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-global'));
    const [, actions] = result.current;

    act(() => actions.resetStore());
  });

  describe('addDeviceLocationCountMap', () => {
    it('adds deviceLocationCounts maps in the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      const map1 = new Map<string, number>();
      map1.set('/path1', 1);
      act(() => actions.addDeviceLocationCountMap(map1));

      expect(result1.current[0].deviceLocationCountMap.has('/path1')).toBe(true);

      const map2 = new Map<string, number>();
      map2.set('/path2', 2);
      act(() => actions.addDeviceLocationCountMap(map2));

      expect(result1.current[0].deviceLocationCountMap.get('/path1')).toBe(1);
      expect(result1.current[0].deviceLocationCountMap.get('/path2')).toBe(2);

      const map3 = new Map<string, number>();
      map3.set('/path2', 3);
      act(() => actions.addDeviceLocationCountMap(map3));

      expect(result1.current[0].deviceLocationCountMap.get('/path1')).toBe(1);
      expect(result1.current[0].deviceLocationCountMap.get('/path2')).toBe(3);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].deviceLocationCountMap.has('/path1')).toBe(false);
    });
  });

  describe('addScheduleDefinitionCountMap', () => {
    it('adds scheduleDefinitionCountMap maps in the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      const map1 = new Map<string, number>();
      map1.set('/path1', 1);
      act(() => actions.addScheduleDefinitionCountMap(map1));

      expect(result1.current[0].scheduleDefinitionCountMap.has('/path1')).toBe(true);

      const map2 = new Map<string, number>();
      map2.set('/path2', 2);
      act(() => actions.addScheduleDefinitionCountMap(map2));

      expect(result1.current[0].scheduleDefinitionCountMap.get('/path1')).toBe(1);
      expect(result1.current[0].scheduleDefinitionCountMap.get('/path2')).toBe(2);

      const map3 = new Map<string, number>();
      map3.set('/path2', 3);
      act(() => actions.addScheduleDefinitionCountMap(map3));

      expect(result1.current[0].scheduleDefinitionCountMap.get('/path1')).toBe(1);
      expect(result1.current[0].scheduleDefinitionCountMap.get('/path2')).toBe(3);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].scheduleDefinitionCountMap.has('/path1')).toBe(false);
    });
  });

  describe('addFarmDefObjects', () => {
    it('adds FarmDefObject to the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      act(() => actions.addFarmDefObjects([site]));

      expect(result1.current[0].farmDefObjects).toContain(site);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].farmDefObjects).toContain(site);
    });

    it('adds DeviceLocation to the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      act(() => actions.addFarmDefObjects([deviceLocationUnderSite]));

      expect(result1.current[0].farmDefObjects).toContain(deviceLocationUnderSite);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].farmDefObjects).toContain(deviceLocationUnderSite);
    });

    it('adds ContainerLocation to the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      act(() => actions.addFarmDefObjects([containerLocationUnderGrowRoom]));

      expect(result1.current[0].farmDefObjects).toContain(containerLocationUnderGrowRoom);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].farmDefObjects).toContain(containerLocationUnderGrowRoom);
    });

    it('avoids duplicating objects', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      act(() => actions.addFarmDefObjects([site, deviceLocationUnderSite]));
      expect(result1.current[0].farmDefObjects).toContain(site);
      expect(result1.current[0].farmDefObjects).toContain(deviceLocationUnderSite);
      expect(result1.current[0].farmDefObjects).toHaveLength(2);

      act(() => actions.addFarmDefObjects([site, deviceLocationUnderSite]));
      expect(result1.current[0].farmDefObjects).toContain(site);
      expect(result1.current[0].farmDefObjects).toContain(deviceLocationUnderSite);
      expect(result1.current[0].farmDefObjects).toHaveLength(2);
    });
  });

  describe('addFarmDefSiteWithChildren', () => {
    it('adds a FarmDefSite to the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].farmDefSitesWithChildren).toHaveLength(0);

      act(() => actions.addFarmDefSiteWithChildren(site));
      expect(result1.current[0].farmDefSitesWithChildren).toContain(site);
      expect(result1.current[0].farmDefSitesWithChildren).toHaveLength(1);

      act(() => actions.addFarmDefSiteWithChildren(site));
      expect(result1.current[0].farmDefSitesWithChildren).toHaveLength(1);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      expect(result2.current[0].farmDefSitesWithChildren).toHaveLength(1);
    });

    it('overrides a FarmDefSite in the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].farmDefSitesWithChildren).toHaveLength(0);

      act(() => actions.addFarmDefSiteWithChildren(site));
      expect(result1.current[0].farmDefSitesWithChildren).toContain(site);
      expect(result1.current[0].farmDefSitesWithChildren.find(site => site.path === site.path).properties).toEqual({});
      expect(result1.current[0].farmDefSitesWithChildren).toHaveLength(1);

      const sameSiteWithNewerAttributes = { ...site, properties: { farmCode: 'TIGRIS ' } };
      act(() => actions.addFarmDefSiteWithChildren(sameSiteWithNewerAttributes));
      expect(result1.current[0].farmDefSitesWithChildren).toHaveLength(1);
      expect(result1.current[0].farmDefSitesWithChildren.find(site => site.path === site.path).properties).toEqual({
        farmCode: 'TIGRIS ',
      });

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      expect(result2.current[0].farmDefSitesWithChildren).toHaveLength(1);
    });
  });

  describe('addSchedules', () => {
    const scheduleIds = new Set([...mockSchedules.map(schedule => schedule.id)]);

    it('adds Schedule in the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].farmDefObjects).toHaveLength(0);

      act(() => actions.addFarmDefObjects([site]));
      act(() => actions.addSchedules(mockSchedules));
      expect(result1.current[0].farmDefObjects).toEqual([site, ...mockSchedules]);
      expect(result1.current[0].scheduleIds).toEqual(scheduleIds);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      expect(result2.current[0].farmDefObjects).toEqual([site, ...mockSchedules]);
      expect(result1.current[0].scheduleIds).toEqual(scheduleIds);
    });

    it('overrides an existing Schedule in the store', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].farmDefObjects).toHaveLength(0);

      act(() => actions.addFarmDefObjects([site]));
      act(() => actions.addSchedules(mockSchedules));
      expect(result1.current[0].farmDefObjects).toEqual([site, ...mockSchedules]);
      expect(result1.current[0].scheduleIds).toEqual(scheduleIds);

      const newSchedules = [{ ...mockSchedules[0], scheduleType: ScheduleType.EVENT }];
      act(() => actions.addSchedules(newSchedules));
      expect(result1.current[0].farmDefObjects).not.toEqual([site, ...mockSchedules]);
      expect(result1.current[0].farmDefObjects).toEqual([site, ...mockSchedules.slice(1), ...newSchedules]);
      expect(result1.current[0].scheduleIds).toEqual(scheduleIds);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      expect(result2.current[0].farmDefObjects).toEqual([site, ...mockSchedules.slice(1), ...newSchedules]);
      expect(result1.current[0].scheduleIds).toEqual(scheduleIds);
    });
  });

  describe('goBackToParent', () => {
    it('navigates back the hierarchy', () => {
      const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result.current;

      expect(result.current[0].selectedFarmDefObject).toBeNull();

      act(() => actions.addFarmDefObjects([site, area, line, deviceLocationUnderSite]));
      act(() => actions.setSelectedFarmDefObject(line));

      expect(result.current[0].selectedFarmDefObject).toEqual(line);

      act(() => actions.goBackToParent());

      expect(result.current[0].selectedFarmDefObject).toEqual(area);

      act(() => actions.goBackToParent());

      expect(result.current[0].selectedFarmDefObject).toEqual(site);

      act(() => actions.goBackToParent());

      expect(result.current[0].selectedFarmDefObject).toBeNull();
    });

    it('goes back to the parent holding the deviceLocation', () => {
      const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result.current;

      expect(result.current[0].selectedFarmDefObject).toBeNull();

      act(() => actions.addFarmDefObjects([site, area, line, deviceLocationUnderSite, deviceLocationUnderLine]));
      act(() => actions.setSelectedFarmDefObject(deviceLocationUnderLine));

      expect(result.current[0].selectedFarmDefObject).toEqual(deviceLocationUnderLine);

      act(() => actions.goBackToParent());

      expect(result.current[0].selectedFarmDefObject).toEqual(line);

      act(() => actions.setSelectedFarmDefObject(deviceLocationUnderSite));

      expect(result.current[0].selectedFarmDefObject).toEqual(deviceLocationUnderSite);

      act(() => actions.goBackToParent());

      expect(result.current[0].selectedFarmDefObject).toEqual(site);
    });
  });

  describe('setOptions', () => {
    it('sets the options', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].options).toEqual(initialScopedState.options);

      act(() => actions.setOptions({ showDeviceLocations: true }));

      expect(result1.current[0].options).toEqual({ ...initialScopedState.options, showDeviceLocations: true });

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].options).toEqual(initialScopedState.options);
    });
  });

  describe('setInputvalue', () => {
    it('sets the input value', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].inputValue).toBe('');

      act(() => actions.setInputvalue('mock-value'));

      expect(result1.current[0].inputValue).toBe('mock-value');

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].inputValue).toBe('');
    });
  });

  describe('setIsOpen', () => {
    it('sets isOpen to true', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].isOpen).toBe(false);

      act(() => actions.setIsOpen(true));

      expect(result1.current[0].isOpen).toBe(true);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].isOpen).toBe(false);
    });
  });

  describe('setSelectedFarmDefObject', () => {
    it('sets a selectedFarmDefObject', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].selectedFarmDefObject).toBeNull();

      act(() => actions.addFarmDefObjects([site, area]));
      act(() => actions.setSelectedFarmDefObject(area));

      expect(result1.current[0].selectedFarmDefObject).toEqual(area);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].selectedFarmDefObject).toBeNull();
    });
  });

  describe('setTreeObservationGroups', () => {
    it('sets a treeObservationGroups', () => {
      const tree = { count: 0, children: { a: { count: 1, children: {} } } };
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].treeObservationGroups).toEqual({ count: 0, children: {} });

      act(() => actions.setTreeObservationGroups(tree));

      expect(result1.current[0].treeObservationGroups).toEqual(tree);

      const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

      expect(result2.current[0].treeObservationGroups).toEqual(tree);
    });
  });

  describe('unregisterState', () => {
    it('unregisters the scoped state', () => {
      const { result: result1 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));
      const [, actions] = result1.current;

      expect(result1.current[0].inputValue).toBe('');

      act(() => actions.setInputvalue('foobar'));
      act(() => actions.addFarmDefObjects([site, area]));
      act(() => actions.setSelectedFarmDefObject(area));
      act(() => actions.setIsOpen(true));

      expect(result1.current[0].inputValue).toBe('foobar');
      expect(result1.current[0].selectedFarmDefObject).toEqual(area);
      expect(result1.current[0].isOpen).toBe(true);

      act(() => actions.unregisterState());

      expect(result1.current[0].inputValue).toBe('');
      expect(result1.current[0].selectedFarmDefObject).toBeNull();
      expect(result1.current[0].isOpen).toBe(false);
    });
  });
});
