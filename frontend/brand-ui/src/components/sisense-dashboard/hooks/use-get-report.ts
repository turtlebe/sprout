import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

interface GetReportResponse {
  url: string;
  expiresAt: number;
  lastRefreshedAt: string;
}

export const useGetReport = (dashboardName: string) => {
  return useSwrAxios<GetReportResponse>({ url: `/api/sisense/dashboards/${dashboardName}` });
};
