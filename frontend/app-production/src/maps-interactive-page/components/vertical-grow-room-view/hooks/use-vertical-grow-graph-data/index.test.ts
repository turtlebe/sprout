import {
  mockFarmDefMachine,
  mockFarmDefMachineSStyle,
  mockFarmDefMachineUturnStyle,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { renderHook } from '@testing-library/react-hooks';

import { useVerticalGrowGraphData } from '.';

describe('useVerticalGrowGraphData', () => {
  it('returns correct sorted container locations', () => {
    // ACT
    const { result } = renderHook(() => useVerticalGrowGraphData(mockFarmDefMachineUturnStyle));

    // ASSERT
    const { sortedContainerLocations } = result.current;

    expect(sortedContainerLocations[0].name).toEqual('A0');
    expect(sortedContainerLocations[1].name).toEqual('A1');
    expect(sortedContainerLocations[2].name).toEqual('UTurn');
    expect(sortedContainerLocations[3].name).toEqual('B0');
    expect(sortedContainerLocations[4].name).toEqual('B1');
    expect(sortedContainerLocations[5].name).toEqual('B2');
  });

  it('returns correct object grouped by different lanes for LAX farm (i.e. uturn style)', () => {
    // ACT
    const { result } = renderHook(() => useVerticalGrowGraphData(mockFarmDefMachineUturnStyle));

    // ASSERT
    const { lanes } = result.current;
    const [first, second, third] = lanes;

    expect(first.laneName).toEqual('A');
    expect(first.towers.length).toBe(2);
    expect(second.laneName).toEqual('-');
    expect(second.towers.length).toBe(1);
    expect(third.laneName).toEqual('B');
    expect(third.towers.length).toBe(3);
  });

  it('returns correct object grouped by different lanes for complex geometry (i.e. S style)', () => {
    // ACT
    const { result } = renderHook(() => useVerticalGrowGraphData(mockFarmDefMachineSStyle));

    // ASSERT
    const { lanes } = result.current;
    const [first, second, third, fourth, fifth] = lanes;
    expect(first.laneName).toEqual('A');
    expect(second.laneName).toEqual('-');
    expect(third.laneName).toEqual('B');
    expect(fourth.laneName).toEqual('-');
    expect(fifth.laneName).toEqual('C');
  });

  it('returns correct object for Tigris legacy farms (i.e. straight style)', () => {
    // ACT
    const { result } = renderHook(() => useVerticalGrowGraphData(mockFarmDefMachine));

    // ASSERT
    const { lanes } = result.current;
    expect(lanes.length).toBe(1);
    const [first] = lanes;
    expect(first.laneName).toEqual('default');
    expect(first.towers.length).toBe(1);
  });

  it('seemlessly returns empty if machine is not defiend', () => {
    // ACT
    const { result } = renderHook(() => useVerticalGrowGraphData(null));

    // ASSERT
    const { lanes, sortedContainerLocations } = result.current;
    expect(lanes.length).toBe(0);
    expect(sortedContainerLocations.length).toBe(0);
  });
});
