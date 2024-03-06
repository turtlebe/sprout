import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useUnpaginate, UseUnpaginateReturn } from '@plentyag/core/src/hooks';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, TimeGranularity } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseFetchNonNumericalObservations {
  metric: Metric;
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
  valueAttribute?: string;
}

export interface UseFetchNonNumericalObservationsReturn extends UseUnpaginateReturn<RolledUpByTimeObservation[], any> {
  previousTimeGranularity: TimeGranularity;
  previousValueAttribute: string;
}

/***
 * Fetch Normalized Observations for a given Metric.
 */
export const useFetchNonNumericalObservations = ({
  metric,
  startDateTime,
  endDateTime,
  timeGranularity,
  valueAttribute,
}: UseFetchNonNumericalObservations): UseFetchNonNumericalObservationsReturn => {
  const snackbar = useGlobalSnackbar();
  const [previousTimeGranularity, setPreviousTimeGranularity] = React.useState(timeGranularity);
  const [previousValueAttribute, setPreviousValueAttribute] = React.useState(valueAttribute);
  const unpaginate = useUnpaginate<RolledUpByTimeObservation[]>({
    serviceName: 'observation-digest-service',
    operation: 'search-rolled-up-by-time-observations',
  });

  const { makeRequest } = unpaginate;

  React.useEffect(() => {
    makeRequest({
      data: {
        path: metric.path,
        measurementType: metric.measurementType,
        observationName: metric.observationName,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        timeGranularity: timeGranularity.value,
        order: 'asc',
        isNumerical: false,
        valueAttribute,
      },
      onSuccess: () => {
        setPreviousTimeGranularity(timeGranularity);
        setPreviousValueAttribute(valueAttribute);
      },
      onError: error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ message, title: 'Failed to fetch data.' });
      },
    });
  }, [metric, startDateTime, endDateTime, timeGranularity, valueAttribute]);

  return { ...unpaginate, previousTimeGranularity, previousValueAttribute };
};
