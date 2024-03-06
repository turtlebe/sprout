import { axiosRequest } from '@plentyag/core/src/utils/request';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import { AxiosRequestConfig } from 'axios';
import React from 'react';
import { useMountedState } from 'react-use';

export interface MakeRequestParams<ResponseData, RequestData = any> {
  onSuccess?: (responseData: ResponseData, headers?: any) => Promise<void> | void; // allow success to be async.
  onError?: (error: any) => void;
  queryParams?: any; // get query string parameters
  data?: RequestData; // post/patch/put body data payload
  url?: string;
}

export interface UseAxios extends AxiosRequestConfig {}

export interface UseAxiosReturn<ResponseData, RequestData = any> {
  data: ResponseData;
  error: any;
  isLoading: boolean;
  makeRequest: (params?: MakeRequestParams<ResponseData, RequestData>) => void;
}

/**
 * Hook to execute request through axios. The hook returns data, error, a flag to indicate the loading
 * state and a makeRequest callback to execute the request.
 *
 * @param axiosConfig @see UseAxios
 * @return @see UseAxiosReturn
 */
export const useAxios = <ResponseData, RequestData = any>(
  axiosConfig: UseAxios
): UseAxiosReturn<ResponseData, RequestData> => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ResponseData | undefined>(undefined);
  const [error, setError] = React.useState(undefined);
  const isMounted = useMountedState();

  const whenMounted = fn => {
    if (isMounted()) {
      fn();
    }
  };

  const makeRequest: UseAxiosReturn<ResponseData, RequestData>['makeRequest'] = React.useCallback(
    async (params = {}) => {
      whenMounted(() => setIsLoading(true));
      try {
        if (params.url) {
          axiosConfig.url = params.url;
        }
        if (!axiosConfig.url) {
          throw new Error('`url` is undefined. Please specify a url when using `useAxios` or `makeRequest`');
        }
        if (axiosConfig.method === 'GET' && params.queryParams) {
          axiosConfig.url = axiosConfig.url.split('?')[0] + toQueryParams(params.queryParams);
        }
        const { data, headers } = await axiosRequest<ResponseData>({ ...axiosConfig, ...{ data: params.data } });
        whenMounted(() => setData(data));
        if (params.onSuccess) {
          await Promise.resolve(params.onSuccess(data, headers));
        }
      } catch (error) {
        if (error.response) {
          whenMounted(() => setError(error.response));
          if (params.onError) {
            params.onError(error.response);
          }
          return;
        } else if (error.request) {
          whenMounted(() => setError(error));
          if (params.onError) {
            params.onError(error);
          }
          return;
        }

        // Something went wrong with the code and not the network,
        // bubble up error to let global error handle this.
        throw error;
      } finally {
        whenMounted(() => setIsLoading(false));
      }
    },
    [axiosConfig]
  );

  return { data, error, isLoading, makeRequest };
};

export const usePostRequest = <ResponseData, PostData>(
  axiosConfig: UseAxios
): UseAxiosReturn<ResponseData, PostData> => {
  return useAxios<ResponseData, PostData>({ ...axiosConfig, method: 'POST' });
};

export const usePatchRequest = <ResponseData, PatchData>(
  axiosConfig: UseAxios
): UseAxiosReturn<ResponseData, PatchData> => {
  return useAxios<ResponseData, PatchData>({ ...axiosConfig, method: 'PATCH' });
};

export const useGetRequest = <ResponseData>(axiosConfig: UseAxios): UseAxiosReturn<ResponseData> => {
  return useAxios<ResponseData>({ ...axiosConfig, method: 'GET' });
};

export const useDeleteRequest = <ResponseData>(axiosConfig: UseAxios): UseAxiosReturn<ResponseData> => {
  return useAxios<ResponseData>({ ...axiosConfig, method: 'DELETE' });
};

export const usePutRequest = <ResponseData, PutData>(axiosConfig: UseAxios): UseAxiosReturn<ResponseData> => {
  return useAxios<ResponseData, PutData>({ ...axiosConfig, method: 'PUT' });
};
