import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import {
  mockFarmDefLine,
  mockFarmDefLineWithUnsupportedMachine,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { renderHook } from '@testing-library/react-hooks';

import { useLoadMapsLineData } from '.';

jest.mock('@plentyag/app-production/src/common/hooks');

describe('useLoadMapsLineData', () => {
  it('should be able to show loading state', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: true,
      data: null,
    });

    // ACT
    const { result } = renderHook(() => useLoadMapsLineData('sites/SSF2/areas/VerticalGrow/lines/GrowRoom'));

    // ASSERT
    expect(result.current.data).toBeFalsy();
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.line).toBeFalsy();
    expect(result.current.machines.length).toBe(0);
  });

  it('should return supported machines', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockFarmDefLine,
    });

    // ACT
    const { result } = renderHook(() => useLoadMapsLineData('sites/SSF2/areas/VerticalGrow/lines/GrowRoom'));

    // ASSERT
    expect(result.current.data).toEqual(mockFarmDefLine);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.line.machines.GrowLane1).toBeTruthy();
    expect(result.current.machines.length).toBe(1);
  });

  it('should not return unsupported machines', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockFarmDefLineWithUnsupportedMachine,
    });

    // ACT
    const { result } = renderHook(() => useLoadMapsLineData('sites/SSF2/areas/VerticalGrow/lines/GrowRoom'));

    // ASSERT
    expect(result.current.machines).not.toEqual(mockFarmDefLineWithUnsupportedMachine);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.line.machines).toEqual({});
    expect(result.current.machines.length).toBe(0);
  });
});
