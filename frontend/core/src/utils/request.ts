import { getFlaskEnvironmentVariable } from '@plentyag/core/src/utils/get-flask-environment-variable';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import _merge from 'lodash/merge';

import { trackXhrEvent } from '../analytics';

const getDefaultAxiosConfig = (): AxiosRequestConfig => ({
  // axios will extract cookie and send in header.
  xsrfCookieName: getFlaskEnvironmentVariable('SPROUT_CSRF_COOKIE_NAME'),
  xsrfHeaderName: 'X-CSRFToken',
});

const newAxiosRequest = (config: AxiosRequestConfig = {}): AxiosInstance => {
  const method = config.method ? config.method.toLocaleUpperCase() : 'GET';
  trackXhrEvent(method, config.url);

  config = _merge({}, getDefaultAxiosConfig(), config);

  const axiosInstance = axios.create(config);

  // retry just once, if response is 401 code with error message indicating csrf was regenerated.
  // this retry should succeed.
  const retryConfig = {
    retries: 1,
    retryCondition: (error: AxiosError) => {
      return (
        error?.response?.status === 401 &&
        error?.response?.data?.message?.error?.startsWith('CSRF check failed, regenerating token')
      );
    },
  };

  axiosRetry(axiosInstance, retryConfig);

  return axiosInstance;
};

export const axiosRequest = async <T>(config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> =>
  newAxiosRequest(config).request(config);
