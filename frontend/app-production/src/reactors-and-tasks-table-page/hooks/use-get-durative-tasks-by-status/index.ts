import { DurativeTaskState, TaskStatus } from '@plentyag/app-production/src/common/types';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

export interface UseGetDurativeTasksBySiteReturn {
  tasks: DurativeTaskState[];
  refetch: () => Promise<boolean>;
  isLoading: boolean;
}

export const useGetDurativeTasksByStatus = (taskStatus: TaskStatus): UseGetDurativeTasksBySiteReturn => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;

  const siteName = getKindFromPath(currentFarmDefPath, 'sites');
  const url = siteName && taskStatus && '/api/plentyservice/executive-service/get-durative-tasks-by-site';

  const {
    data: tasks,
    revalidate: refetch,
    error,
    isValidating,
  } = useSwrAxios<DurativeTaskState[]>({
    url,
    params: {
      siteName,
      taskStatus,
    },
  });

  useLogAxiosErrorInSnackbar(error);

  return { tasks, refetch, isLoading: isValidating };
};
