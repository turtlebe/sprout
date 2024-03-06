import { isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { toQueryParams } from '@plentyag/core/src/utils';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../';

export const useLoadSchedules = (id: string, resolveScheduleDefinition: boolean) => {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);

  const swrAxios = useSwrAxios<PaginatedList<Schedule>>({
    url:
      resolveScheduleDefinition &&
      isScheduleDefinition(state.selectedFarmDefObject) &&
      `/api/swagger/environment-service/schedules-api/list-schedules${toQueryParams({
        path: state.selectedFarmDefObject.path,
      })}`,
  });

  const { data: paginatedSchedules, error } = swrAxios;
  useLogAxiosErrorInSnackbar(error);

  React.useEffect(() => {
    if (paginatedSchedules) {
      actions.addSchedules(paginatedSchedules.data);
      if (paginatedSchedules.meta.total > 1) {
        actions.setIsOpen(true);
      } else if (paginatedSchedules.meta.total === 1) {
        actions.setSelectedFarmDefObject(paginatedSchedules.data[0]);
      }
    }
  }, [paginatedSchedules]);

  return swrAxios;
};
