import { mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useDashboardApi } from '.';

const dashboardId = 'dashboard-id';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

mockUseFetchMeasurementTypes();

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const [dashboard] = mockDashboards;

describe('useDashboardApi', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() => useDashboardApi({ dashboardId }));

    expect(result.current.dashboard).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.dashboard).toBeUndefined();
  });

  it('returns the dashboard', () => {
    mockUseSwrAxios.mockReturnValue({ data: dashboard, isValidating: false });

    const { result } = renderHook(() => useDashboardApi({ dashboardId }));

    expect(result.current.dashboard).toBe(dashboard);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.dashboard).toEqual(dashboard);
  });
});
