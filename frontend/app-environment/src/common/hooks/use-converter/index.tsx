import { useScheduleDefinitionContext, useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { convertUnitForMetric, convertUnitForSchedule } from '@plentyag/app-environment/src/common/utils';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Metric, Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface UseConverter {
  schedule?: Schedule;
  schedules?: Schedule[];
  metric?: Metric;
  metrics?: Metric[];
}

export interface UseConverterReturn extends UseConverter {
  scheduleDefinition?: ScheduleDefinition;
  scheduleDefinitions?: ScheduleDefinition[];
  isLoading: boolean;
}

/**
 * Perform unit conversions on Metrics/AlertRules and/or Schedules.
 *
 * This hook is flexible to accept one or many metrics or one or many schedules.
 *
 * When passing schedules, it automatically fetches the schedule definitions and returns a loader if one of
 * the schedule definition is currently being fetched.
 *
 * When passing metrics, we can simply apply unit conversion right away without having to fetch extra data,
 * therefore the loading status would always be false.
 */
export const useConverter = ({
  schedule: rawSchedule,
  schedules: rawSchedules,
  metric: rawMetric,
  metrics: rawMetrics,
}: UseConverter): UseConverterReturn => {
  const { convertToPreferredUnit } = useUnitConversion();
  const {
    scheduleDefinitions: contextScheduleDefinitions,
    loadingStatuses,
    fetchScheduleDefinition,
  } = useScheduleDefinitionContext();

  // Convert a single Metric
  const metric = React.useMemo(() => {
    if (!rawMetric) {
      return undefined;
    }

    return convertUnitForMetric(value => convertToPreferredUnit(value, rawMetric.measurementType))(rawMetric);
  }, [rawMetric]);

  // Convert an array of Metrics
  const metrics = React.useMemo(() => {
    if (!rawMetrics?.length) {
      return undefined;
    }

    return rawMetrics.map(rawMetric =>
      convertUnitForMetric(value => convertToPreferredUnit(value, rawMetric.measurementType))(rawMetric)
    );
  }, [rawMetrics]);

  // Load single Schedule Definition
  React.useEffect(() => {
    if (!rawSchedule) {
      return;
    }

    fetchScheduleDefinition(rawSchedule.path);
  }, [rawSchedule]);

  // Load multiple Schedule Definition
  React.useEffect(() => {
    if (!rawSchedules) {
      return;
    }

    rawSchedules.forEach(rawSchedule => {
      fetchScheduleDefinition(rawSchedule.path);
    });
  }, [rawSchedules]);

  // Get ScheduleDefinition when a single Schedule is passed in
  const scheduleDefinition = React.useMemo(
    () => contextScheduleDefinitions[rawSchedule?.path],
    [rawSchedule, contextScheduleDefinitions[rawSchedule?.path]]
  );

  // Get an array of ScheduleDefinitions when multiple Schedules are passed in
  const scheduleDefinitions = React.useMemo(() => {
    if (!rawSchedules?.length) {
      return undefined;
    }

    return rawSchedules.map(rawSchedule => contextScheduleDefinitions[rawSchedule.path]).filter(Boolean);
  }, [rawSchedules, contextScheduleDefinitions]);

  // Convert a single Schedule
  const schedule = React.useMemo(() => {
    if (!rawSchedule) {
      return undefined;
    }

    if (!scheduleDefinition) {
      return rawSchedule;
    }

    return convertUnitForSchedule((value, actionDefinition) =>
      convertToPreferredUnit(value, actionDefinition.measurementType)
    )(rawSchedule, scheduleDefinition);
  }, [rawSchedule, scheduleDefinition]);

  // Convert an array of Schedules
  const schedules = React.useMemo(() => {
    if (!rawSchedules?.length) {
      return undefined;
    }

    return rawSchedules.map(rawSchedule => {
      const scheduleDefinition = scheduleDefinitions.find(
        scheduleDefinition => scheduleDefinition.path === rawSchedule.path
      );

      if (!scheduleDefinition) {
        return rawSchedule;
      }

      return convertUnitForSchedule((value, actionDefinition) =>
        convertToPreferredUnit(value, actionDefinition.measurementType)
      )(rawSchedule, scheduleDefinition);
    });
  }, [rawSchedules, scheduleDefinitions]);

  // Calculate isLoading during while Schedule Definitions are being fetched
  const isLoading = React.useMemo(() => {
    if (!schedule && !schedules?.length) {
      return false;
    }

    if (schedule) {
      return loadingStatuses[schedule.path] ?? true;
    }

    return schedules.some(schedule => loadingStatuses[schedule.path] ?? true);
  }, [schedule, schedules, loadingStatuses]);

  return {
    metric,
    metrics,
    schedule,
    schedules,
    scheduleDefinition,
    scheduleDefinitions,
    isLoading,
  };
};
