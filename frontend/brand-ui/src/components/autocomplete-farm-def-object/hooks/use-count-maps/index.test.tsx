import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '..';
import { saveFarmDefObjectsInStore } from '../../utils';

import { useCountMaps } from '.';

describe('useCountMaps', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-global'));
    const [, actions] = result.current;

    act(() => actions.resetStore());
  });

  it('creates a deviceLocationCountMap counting all device types in the store', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));

    act(() => saveFarmDefObjectsInStore(root.sites['SSF2'], result.current[1]));
    act(() => result.current[1].setSelectedFarmDefObject(root.sites['SSF2']));

    expect(result.current[0].farmDefObjects).not.toHaveLength(0);
    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 0);

    renderHook(() => useCountMaps('mock-id-1', undefined));

    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 8);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2')).toBe(5);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding')).toBe(2);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(2);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/farms/Tigris')).toBe(0);

    const { result: result2 } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-2'));

    expect(result2.current[0].farmDefObjects).not.toHaveLength(0);
    expect(result2.current[0].deviceLocationCountMap).toHaveProperty('size', 0);
  });

  it('creates a deviceLocationCountMap for specific device types in the store', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));

    act(() => saveFarmDefObjectsInStore(root.sites['SSF2'], result.current[1]));
    act(() => result.current[1].setSelectedFarmDefObject(root.sites['SSF2']));

    expect(result.current[0].farmDefObjects).not.toHaveLength(0);
    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 0);

    const deviceTypes = ['BaslerACA402429uc'];
    renderHook(() => useCountMaps('mock-id-1', deviceTypes));

    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 8);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2')).toBe(2);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/farms/Tigris')).toBe(0);
  });

  it('updates the map when device types change', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));

    act(() => saveFarmDefObjectsInStore(root.sites['SSF2'], result.current[1]));
    act(() => result.current[1].setSelectedFarmDefObject(root.sites['SSF2']));

    expect(result.current[0].farmDefObjects).not.toHaveLength(0);
    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 0);

    const { rerender } = renderHook(({ deviceTypes }) => useCountMaps('mock-id-1', deviceTypes), {
      initialProps: { deviceTypes: ['BaslerACA402429uc'] },
    });

    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 8);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2')).toBe(2);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/farms/Tigris')).toBe(0);

    rerender({ deviceTypes: ['BaslerACA308816gc'] });

    expect(result.current[0].deviceLocationCountMap).toHaveProperty('size', 8);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/areas/Seeding/lines/TraySeeding')).toBe(1);
    expect(result.current[0].deviceLocationCountMap.get('sites/SSF2/farms/Tigris')).toBe(0);
  });
});
