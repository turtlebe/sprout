import { useLogAxiosErrorInSnackbar, useRunActionPeriodicallyWhenVisible, useSwrAxios } from '@plentyag/core/src/hooks';
import { AxiosRequestConfig } from 'axios';

import { REFRESH_INTERVAL } from '../../constants';

export interface useGetStateReturn<StateReturnType> {
  data: StateReturnType;
  isLoading: boolean;
  error: any;
  reload: () => void;
}

interface UseGetState {
  axiosRequestConfig: AxiosRequestConfig;
  errorTitle: string;
  enablePeriodicRefresh?: boolean;
}

export const useGetState = <StateReturnType>({
  axiosRequestConfig,
  errorTitle,
  enablePeriodicRefresh = true,
}: UseGetState): useGetStateReturn<StateReturnType> => {
  const { data, error, revalidate, isValidating: isLoading } = useSwrAxios<StateReturnType>(axiosRequestConfig);

  // executive service gives 503 errors for akka timeouts and non-implemented reactors, in this case
  // we suppress console.error messages so they don't flood datadog.
  const suppressConsoleLog = error?.response?.status === 503;
  useLogAxiosErrorInSnackbar(error, errorTitle, suppressConsoleLog);

  useRunActionPeriodicallyWhenVisible({
    condition: () => enablePeriodicRefresh && axiosRequestConfig && !isLoading,
    action: () => void revalidate(),
    period: REFRESH_INTERVAL,
  });

  return { data, isLoading, error, reload: revalidate };
};
