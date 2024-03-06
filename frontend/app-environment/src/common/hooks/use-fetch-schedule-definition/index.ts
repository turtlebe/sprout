import { getScheduleDefinitionUrl } from '@plentyag/app-environment/src/common/utils';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';

export interface UseFetchScheduleDefinitionReturn extends UseSwrAxiosReturn<ScheduleDefinition> {}

/**
 * Given a schedule path, fetch the schedule definition from FDS using ObjectsV3 API.
 */
export const useFetchScheduleDefinition = (schedulePath: string): UseFetchScheduleDefinitionReturn => {
  const swrAxios = useSwrAxios<ScheduleDefinition>({
    url: schedulePath && getScheduleDefinitionUrl(schedulePath),
  });

  useLogAxiosErrorInSnackbar(swrAxios.error);

  return swrAxios;
};
