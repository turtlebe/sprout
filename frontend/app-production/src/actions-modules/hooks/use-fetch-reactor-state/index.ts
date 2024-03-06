import { ReactorStateReturnType } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

export interface UseFetchReactorStateReturn {
  reactorState: ReactorStateReturnType;
  revalidate: () => Promise<boolean>;
  isLoading: boolean;
}

export const REACTOR_STATE_URL = '/api/plentyservice/executive-service/get-reactor-state';

export const useFetchReactorState = (reactorPath: string): UseFetchReactorStateReturn => {
  const {
    data,
    revalidate,
    isValidating: isLoading,
    error,
  } = useSwrAxios<ReactorStateReturnType>({
    url: reactorPath && `${REACTOR_STATE_URL}/${reactorPath}`,
  });

  useLogAxiosErrorInSnackbar(error);

  return {
    reactorState: data,
    revalidate,
    isLoading,
  };
};
