import { useFetchScheduleDefinition, useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { Metric, Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';

import { convertUnitForSchedule, EVS_URLS } from '../utils';

const getUrl = (scheduleId: string, metric: Metric) => {
  if (scheduleId) {
    return { url: EVS_URLS.schedules.getByIdUrl(scheduleId) };
  }

  if (metric) {
    return { url: EVS_URLS.schedules.relatedScheduleUrl(metric) };
  }

  return undefined;
};

export interface UseFetchAndConvertScheduleWithDefinition {
  scheduleId?: string;
  metric?: Metric;
}

export interface UseFetchAndConvertScheduleWithDefinitionReturn {
  schedule: Schedule;
  scheduleRequest: UseSwrAxiosReturn<Schedule>;
  scheduleDefinition: ScheduleDefinition;
  isLoading: boolean;
  revalidate: UseSwrAxiosReturn<unknown>['revalidate'];
}

/**
 * Fetch a Schedule from environment-service for the given ID and the ScheduleDefinition associated to it in farm-def-service.
 *
 * This also handle unit conversion based on the User's preferred unit.
 */
export const useFetchAndConvertScheduleWithDefinition = ({
  scheduleId,
  metric,
}: UseFetchAndConvertScheduleWithDefinition): UseFetchAndConvertScheduleWithDefinitionReturn => {
  const { convertToPreferredUnit } = useUnitConversion();

  const schedule = useSwrAxios<Schedule>(getUrl(scheduleId, metric));
  const scheduleDefinition = useFetchScheduleDefinition(schedule?.data?.path);

  const convertedSchedule = React.useMemo(
    () =>
      schedule.data && scheduleDefinition.data
        ? convertUnitForSchedule((value, actionDefinition) =>
            convertToPreferredUnit(value, actionDefinition.measurementType)
          )(schedule.data, scheduleDefinition.data)
        : schedule.data,
    [schedule.data, scheduleDefinition.data]
  );

  return {
    schedule: convertedSchedule,
    scheduleRequest: schedule,
    scheduleDefinition: scheduleDefinition.data,
    isLoading: schedule.isValidating || scheduleDefinition.isValidating,
    revalidate: schedule.revalidate,
  };
};
