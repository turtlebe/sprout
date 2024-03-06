import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import {
  mockFarmDefSite,
  mockFarmDefSiteWithUnsupportedArea,
  mockFarmDefSiteWithUnsupportedLine,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { renderHook } from '@testing-library/react-hooks';

import { useLoadMapsAreasData } from '.';

jest.mock('@plentyag/app-production/src/common/hooks');

describe('useLoadMapsAreasData', () => {
  it('should return supported areas as well as specified farm', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockFarmDefSite,
    });

    // ACT
    const { result } = renderHook(() =>
      useLoadMapsAreasData({
        siteName: 'SSF2',
        farmName: 'Tigris',
      })
    );

    // ASSERT
    // -- complete data should return
    expect(result.current.data).toBeDefined();

    // -- return supported areas and lines
    expect(result.current.areas.length).toBe(1);
    expect(result.current.lines.length).toBe(0);

    // -- return specified farm
    expect(result.current.farm).toEqual(
      expect.objectContaining({
        displayName: 'Tigris',
        name: 'Farm',
      })
    );

    // -- not return since area and line is not specified
    expect(result.current.area).toBeFalsy();
    expect(result.current.line).toBeFalsy();
  });

  it('should return supported areas and lines as well as specified farm, area, and line given site, farm, area and line names', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockFarmDefSite,
    });

    // ACT
    const { result } = renderHook(() =>
      useLoadMapsAreasData({
        siteName: 'SSF2',
        farmName: 'Tigris',
        areaName: 'VerticalGrow',
        lineName: 'GrowRoom1',
      })
    );

    // ASSERT
    // -- complete data should return
    expect(result.current.data).toBeDefined();

    // -- return supported areas and lines
    expect(result.current.areas.length).toBe(1);
    expect(result.current.lines.length).toBe(1);

    // -- return specified farm
    expect(result.current.farm).toEqual(
      expect.objectContaining({
        displayName: 'Tigris',
        name: 'Farm',
      })
    );

    // -- return specified area and supported lines
    expect(result.current.area).toEqual(
      expect.objectContaining({
        displayName: 'Vertical Grow',
        name: 'VerticalGrow',
      })
    );
    expect(result.current.area.lines.GrowRoom1).toEqual(
      expect.objectContaining({
        displayName: 'Grow Room 1',
        name: 'GrowRoom1',
      })
    );

    // -- return specified line
    expect(result.current.line).toEqual(
      expect.objectContaining({
        displayName: 'Grow Room 1',
        name: 'GrowRoom1',
      })
    );
  });

  it('should not return any areas if it is unsupported', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockFarmDefSiteWithUnsupportedArea,
    });

    // ACT
    const { result } = renderHook(() =>
      useLoadMapsAreasData({
        siteName: 'SSF2',
        farmName: 'Tigris',
        areaName: 'UnsupportedArea',
        lineName: 'UnsupportedLine',
      })
    );

    // ASSERT
    // -- complete data should return
    expect(result.current.data).toBeDefined();

    // -- return supported areas and lines
    expect(result.current.areas.length).toBe(0);
    expect(result.current.lines.length).toBe(0);

    // -- return specified farm
    expect(result.current.farm).toEqual(
      expect.objectContaining({
        displayName: 'Tigris',
        name: 'Farm',
      })
    );

    // -- return no area or line
    expect(result.current.area).toBeFalsy();
    expect(result.current.line).toBeFalsy();
  });

  it('should not return areas with unsupported lines', () => {
    // ARRANGE
    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockFarmDefSiteWithUnsupportedLine,
    });

    // ACT
    const { result } = renderHook(() =>
      useLoadMapsAreasData({
        siteName: 'SSF2',
        farmName: 'Tigris',
        areaName: 'VerticalGrow',
        lineName: 'UnsupportedLine',
      })
    );

    // ASSERT
    // -- complete data should return
    expect(result.current.data).toBeDefined();

    // -- return supported areas and lines
    expect(result.current.areas.length).toBe(0);
    expect(result.current.lines.length).toBe(0);

    // -- return specified farm
    expect(result.current.farm).toEqual(
      expect.objectContaining({
        displayName: 'Tigris',
        name: 'Farm',
      })
    );

    // -- return no area or line
    expect(result.current.area).toBeFalsy();
    expect(result.current.line).toBeFalsy();
  });
});
