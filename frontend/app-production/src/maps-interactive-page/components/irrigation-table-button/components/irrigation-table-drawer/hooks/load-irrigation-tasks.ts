import { IrrigationTask } from '@plentyag/app-production/src/maps-interactive-page/types';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useLogAxiosErrorInSnackbar, useUnpaginate } from '@plentyag/core/src/hooks';
import React from 'react';

export interface UseLoadIrrigationTasks {
  lotName?: string;
}
export interface UseLoadIrrigationTasksReturn {
  refreshIrrigationTasks: () => void;
  irrigationTasks: IrrigationTask[];
  isLoading: boolean;
}

export const useLoadIrrigationTasks = ({ lotName }: UseLoadIrrigationTasks): UseLoadIrrigationTasksReturn => {
  const snackbar = useGlobalSnackbar();

  const {
    makeRequest,
    data: irrigationTasks,
    isLoading,
    error,
  } = useUnpaginate<IrrigationTask[]>({
    serviceName: 'executive-service',
    operation: 'search-irrigation-tasks',
  });

  const loadIrrigationTasks = () => {
    if (lotName) {
      makeRequest({
        data: { lotName },
        onSuccess: data => {
          if (!data?.length) {
            snackbar.errorSnackbar({ message: 'No irrigation tasks found.' });
          }
        },
      });
    }
  };

  React.useEffect(() => {
    loadIrrigationTasks();
  }, [lotName]);

  useLogAxiosErrorInSnackbar(error, 'Error loading irrigation tasks');

  return { refreshIrrigationTasks: loadIrrigationTasks, irrigationTasks, isLoading };
};
