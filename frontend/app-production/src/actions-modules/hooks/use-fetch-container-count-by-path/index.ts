import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { toQueryParams } from '@plentyag/core/src/utils';

export interface UseFetchContainerCountByPathReturn {
  data: number;
  revalidate: () => Promise<boolean>;
  isLoading: boolean;
}

export const GET_COUNT_BY_PATH_URL = (bufferName: string) =>
  `/api/production/transfer-conveyance/buffers/states-count/${bufferName}`;

export const useFetchContainerCountByPath = (
  bufferName: string,
  containerTypes: string[]
): UseFetchContainerCountByPathReturn => {
  const {
    data,
    revalidate,
    isValidating: isLoading,
    error,
  } = useSwrAxios<number>({
    url:
      bufferName &&
      containerTypes &&
      `${GET_COUNT_BY_PATH_URL(bufferName)}${toQueryParams({ containerTypes }, { doNotEncodeArray: true })}`,
  });

  useLogAxiosErrorInSnackbar(error);

  return {
    data,
    revalidate,
    isLoading,
  };
};
