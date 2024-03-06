import { renderHook } from '@testing-library/react-hooks';
import { sortBy } from 'lodash';

import { useMemoFarmOsModules } from './use-memo-farmos-modules';

describe('useMemoFarmOsModules', () => {
  it('returns only the allowed FarmOsModules', () => {
    const { result } = renderHook(() => useMemoFarmOsModules(['HYP_ADMIN']));

    expect(result.current).toHaveProperty('allowedFarmOsModules');
    expect(result.current.allowedFarmOsModules).toHaveLength(1);
    expect(result.current.allowedFarmOsModules[0].resource).toBe('HYP_ADMIN');
  });

  it('groups FarmOsModules', () => {
    const { result } = renderHook(() => useMemoFarmOsModules(['HYP_API_DOCS', 'HYP_DATA_DOCS', 'HYP_ADMIN']));

    expect(result.current).toHaveProperty('groupedFarmOsModules');
    expect(result.current).toHaveProperty('sortedFarmOsModuleKeys');

    const groupedFarmOsModules = result.current.groupedFarmOsModules;
    const sortedFarmOsModuleKeys = result.current.sortedFarmOsModuleKeys;

    expect(sortedFarmOsModuleKeys).toHaveLength(2);
    expect(sortedFarmOsModuleKeys).toEqual(['Admin', 'Docs']);
    expect(groupedFarmOsModules['Admin']).toHaveLength(1);
    expect(groupedFarmOsModules['Docs']).toHaveLength(2);
    expect(groupedFarmOsModules['Docs'][0].label).toBe('API Docs');
    expect(groupedFarmOsModules['Docs'][1].label).toBe('Data Docs');
  });

  it('returns a flat sorted array of FarmOsModules', () => {
    const { result } = renderHook(() => useMemoFarmOsModules(['HYP_API_DOCS', 'HYP_DATA_DOCS', 'HYP_ADMIN']));

    expect(result.current).toHaveProperty('sortedFarmOsModules');
    expect(result.current).toHaveProperty('allowedFarmOsModules');

    const sortedFarmOsModules = result.current.sortedFarmOsModules;
    const allowedFarmOsModules = result.current.allowedFarmOsModules;
    const expected = sortBy(allowedFarmOsModules, farmOsModule => farmOsModule.resource.toLowerCase());

    expect(sortedFarmOsModules).toHaveLength(3);
    expect(sortedFarmOsModules).toEqual(expected);
  });
});
