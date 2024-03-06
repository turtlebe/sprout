import { useFetchObservations, UseFetchObservationsReturn } from '@plentyag/app-environment/src/common/hooks';
import { ObservationSelector, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { TimeGranularity } from '@plentyag/core/src/types/environment';

import { getSearchObservationSelectorsUrl } from '../utils';

import { useRelatedMetrics } from '.';

export interface UseRelatedMetricsAndObservations {
  scheduleDefinition: ScheduleDefinition;
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
}

export interface UseRelatedMetricsAndObservationsReturn {
  data: UseFetchObservationsReturn['data'];
  isValidating: boolean;
}

/**
 * For a given ScheduleDefinitions, returns the relevant Metrics and their respective Observations.
 *
 * FDS provides a Mapping API, that for a given ScheduleDefinition path, returns an array of ObservationSelector (path + measurementType + observationName).
 * This means that any schedule following a specific ScheduleDefinition potentially maps to certain Metrics with those foreign keys.
 *
 * With the ObservationSelectors, we query EVS to find the relevant metrics and ODS to find the relevant Observations per Metric.
 */
export const useRelatedMetricsAndObservations = ({
  scheduleDefinition,
  startDateTime,
  endDateTime,
  timeGranularity,
}: UseRelatedMetricsAndObservations): UseRelatedMetricsAndObservationsReturn => {
  const { data: observationSelectors, isValidating: isObsSelectorsLoading } = useSwrAxios<ObservationSelector[]>(
    scheduleDefinition && {
      url: getSearchObservationSelectorsUrl({ path: scheduleDefinition.path }),
    }
  );

  const relatedMetrics = useRelatedMetrics({ observationSelectors });
  const relatedObservations = useFetchObservations({
    metrics: relatedMetrics.data,
    startDateTime,
    endDateTime,
    timeGranularity,
  });

  return {
    data: relatedObservations.data,
    isValidating: isObsSelectorsLoading || relatedMetrics.isValidating || relatedObservations.isValidating,
  };
};
