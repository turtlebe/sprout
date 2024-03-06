import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { axiosRequest } from '../../utils/request';

/**
 * Default Axios config
 */
const DEFAULT_AXIOS_REQUEST_CONFIG: AxiosRequestConfig = {
  method: 'GET',
};

/**
 * Default SWR config
 */
const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  revalidateOnReconnect: false,
};

type CustomSwrConfigInterface<Data, Error> = SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>;

export interface UseSwrAxiosReturn<Data, Error = any>
  extends Omit<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>, 'data'> {
  data: Data;
  responseAxios: Omit<AxiosResponse, 'data'> | {};
}

export const useSwrAxios = <Data = unknown, Error = unknown>(
  axiosRequestConfig: AxiosRequestConfig,
  swrConfig?: CustomSwrConfigInterface<Data, Error>
): UseSwrAxiosReturn<Data, Error> => {
  const modifiedAxiosRequestConfig: AxiosRequestConfig = { ...DEFAULT_AXIOS_REQUEST_CONFIG, ...axiosRequestConfig };
  const modifiedSwrConfig: SWRConfiguration = { ...DEFAULT_SWR_CONFIG, ...swrConfig };
  const swrKey = Boolean(axiosRequestConfig?.url) ? JSON.stringify(modifiedAxiosRequestConfig) : null;

  const {
    data: responseAxios,
    error,
    isValidating,
    revalidate,
    mutate,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    swrKey,
    async () => axiosRequest<Data>(modifiedAxiosRequestConfig),
    modifiedSwrConfig
  );

  // Axios has a wrapper object around data => filter response
  // IMPORTANT: beware useSWR object is not enumerable, so you cannot destructure it with REST (...) props
  const { data, ...responseAxiosOther } = responseAxios || {};

  return {
    /**
     * useSWR props
     */
    data,
    error,
    revalidate,
    isValidating,
    mutate,
    /**
     * additional props
     */
    responseAxios: responseAxiosOther,
  };
};
