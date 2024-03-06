import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { Dashboard } from '@plentyag/core/src/types/environment';

export interface UseDashboardApi {
  dashboardId: string;
}

export interface UseDashboardApiReturn {
  dashboard: Dashboard;
  isLoading: boolean;
  revalidate: () => void;
}

/**
 * Fetch a Dashboard
 */
export const useDashboardApi = ({ dashboardId }: UseDashboardApi): UseDashboardApiReturn => {
  const {
    data: dashboard,
    isValidating,
    revalidate,
  } = useSwrAxios<Dashboard>({ url: EVS_URLS.dashboards.getByIdUrl(dashboardId) });

  return {
    dashboard,
    isLoading: isValidating,
    revalidate,
  };
};
