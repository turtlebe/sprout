import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

export interface RedisJsonObject<T> {
  id?: string;
  key?: string;
  value: T;
}

interface CreateUpdateRedisJsonObjectParams<T> {
  value: T;
  onSuccess?: (response: RedisJsonObject<T>) => void;
}

interface UseRedisJsonObjectApiReturn<T> {
  redisJsonObject?: RedisJsonObject<T>;
  isLoading: boolean;
  createRedisJsonObject: (params: CreateUpdateRedisJsonObjectParams<T>) => void;
  updateRedisJsonObject: (params: CreateUpdateRedisJsonObjectParams<T>) => void;
}

export const useRedisJsonObjectApi = <T>(id?: string): UseRedisJsonObjectApiReturn<T> => {
  const snackbar = useGlobalSnackbar();
  const [redisJsonObject, setRedisJsonObject] = React.useState<RedisJsonObject<T>>();
  const requests = {
    createRedisJsonObject: usePostRequest<RedisJsonObject<T>, RedisJsonObject<T>>({
      url: '/api/core/redis-json-objects',
    }),
    getRedisJsonObject: useSwrAxios<RedisJsonObject<T>>({ url: id && `/api/core/redis-json-objects/${id}` }),
    updateRedisJsonObject: usePutRequest<RedisJsonObject<T>, RedisJsonObject<T>>({
      url: id && `/api/core/redis-json-objects/${id}`,
    }),
  };

  const createRedisJsonObject: UseRedisJsonObjectApiReturn<T>['createRedisJsonObject'] = React.useCallback(
    ({ value, onSuccess }) => {
      requests.createRedisJsonObject.makeRequest({
        data: { value },
        onSuccess: response => {
          setRedisJsonObject(response);
          onSuccess && onSuccess(response);
        },
        onError: error => {
          snackbar.errorSnackbar();
          console.error(error);
        },
      });
    },
    []
  );

  const updateRedisJsonObject: UseRedisJsonObjectApiReturn<T>['updateRedisJsonObject'] = React.useCallback(
    ({ value, onSuccess }) => {
      requests.updateRedisJsonObject.makeRequest({
        data: { value },
        onSuccess: response => {
          setRedisJsonObject(response);
          onSuccess && onSuccess(response);
        },
        onError: error => {
          snackbar.errorSnackbar();
          console.error(error);
        },
      });
    },
    []
  );

  React.useEffect(() => {
    if (requests.getRedisJsonObject.data) {
      setRedisJsonObject(requests.getRedisJsonObject.data);
    }
  }, [requests.getRedisJsonObject.data]);

  return {
    redisJsonObject,
    isLoading:
      requests.getRedisJsonObject.isValidating ||
      requests.createRedisJsonObject.isLoading ||
      requests.updateRedisJsonObject.isLoading,
    createRedisJsonObject,
    updateRedisJsonObject,
  };
};
