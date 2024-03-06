import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useUnpaginate, UseUnpaginateReturn } from '@plentyag/core/src/hooks';
import { NormalizedObservation } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseFetchNormalizedObservations {
  metric?: Metric;
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface UseFetchNormalizedObservationsReturn extends UseUnpaginateReturn<NormalizedObservation[], any> {}

/***
 * Fetch Normalized Observations for a given Metric.
 */
export const useFetchNormalizedObservations = (
  props: UseFetchNormalizedObservations
): UseFetchNormalizedObservationsReturn => {
  const snackbar = useGlobalSnackbar();

  const unpaginate = useUnpaginate<NormalizedObservation[]>({
    serviceName: 'observation-digest-service',
    operation: 'search-normalized-observations',
  });

  const { makeRequest } = unpaginate;

  const { metric, startDateTime, endDateTime } = props || {};

  React.useEffect(() => {
    if (!props) {
      return;
    }

    makeRequest({
      data: {
        path: metric.path,
        measurementType: metric.measurementType,
        observationName: metric.observationName,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        order: 'asc',
        partialPath: true,
      },

      onError: error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ message, title: 'Failed to fetch data.' });
      },
    });
  }, [metric, startDateTime, endDateTime]);

  return { ...unpaginate };
};
