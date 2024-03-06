import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { mockFarmDefSiteObj } from '@plentyag/core/src/farm-def/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useWorkcentersFeatureFlag } from '.';

const mockWorkcenters = Object.values(mockFarmDefSiteObj.workCenters);

jest.mock('@plentyag/brand-ui/src/components/feature-flag');
const mockUseFeatureFlag = useFeatureFlag as jest.Mock;

describe('useWorkcentersFeatureFlag', () => {
  it('should show at least "Seed" workcenter if without feature flag', () => {
    // ARRANGE
    mockUseFeatureFlag.mockReturnValue(undefined);

    // ACT
    const { result } = renderHook(() => useWorkcentersFeatureFlag(mockWorkcenters));

    // ASSERT
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toEqual('Seed');
  });

  it('should enable workcenters specified in feature flag values', () => {
    // ARRANGE
    mockUseFeatureFlag.mockReturnValue('Pack,Harvest,Transplant');

    // ACT
    const { result } = renderHook(() => useWorkcentersFeatureFlag(mockWorkcenters));

    // ASSERT
    expect(result.current).toHaveLength(4);
    expect(result.current[0].name).toEqual('Harvest');
    expect(result.current[1].name).toEqual('Pack');
    expect(result.current[2].name).toEqual('Seed');
    expect(result.current[3].name).toEqual('Transplant');
  });
});
