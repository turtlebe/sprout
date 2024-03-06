import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  convertUnitForRolledUpByTimeObservation,
  getObservationsWithNoData,
  isNumericalMetric,
} from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { MakeRequestParams, useUnpaginate, UseUnpaginateReturn } from '@plentyag/core/src/hooks';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, TimeGranularity } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseFetchAndConvertObservations {
  metric: Metric;
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
  includeSources?: boolean;
  includeNoData?: boolean;
}

export interface UseFetchAndConvertObservationsReturn
  extends Omit<UseUnpaginateReturn<RolledUpByTimeObservation[], any>, 'makeRequest' | 'error'> {}

/**
 * Fetch RolledUpByTimeObservation for a given Metric, and time range.
 *
 * This hooks also takes care of converting the values of the observations to
 * the current user's preferred unit before retunring the data.
 */
export const useFetchAndConvertObservations = ({
  metric,
  startDateTime,
  endDateTime,
  timeGranularity,
  includeSources,
  includeNoData,
}: UseFetchAndConvertObservations): UseFetchAndConvertObservationsReturn => {
  const snackbar = useGlobalSnackbar();
  const { convertToPreferredUnit } = useUnitConversion();

  const {
    data: rawObservations,
    isLoading,
    makeRequest,
  } = useUnpaginate<RolledUpByTimeObservation[]>({
    serviceName: 'observation-digest-service',
    apiName: 'rolled-up-by-time-observations-api',
    operation: 'search-rolled-up-by-time-observations',
  });
  const makeRequestParams = {
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    path: metric?.path,
    measurementType: metric?.measurementType,
    observationName: metric?.observationName,
    order: 'asc',
    timeGranularity: timeGranularity.value,
    includeSources,
    isNumerical: isNumericalMetric(metric),
  };

  const onError: MakeRequestParams<RolledUpByTimeObservation[]>['onError'] = error => {
    const message = parseErrorMessage(error);
    snackbar.errorSnackbar({ message });
  };

  /**
   * Load data when metric, startDateTime, endDateTime or timeGranularity changes.
   */
  React.useEffect(() => {
    if (!metric) {
      return;
    }

    makeRequest({ data: makeRequestParams, onError });
  }, [metric, startDateTime.toISOString(), endDateTime.toISOString(), timeGranularity.value]);

  /**
   * Unit conversion function for Observations.
   */
  function convertObservation(observation: RolledUpByTimeObservation): RolledUpByTimeObservation {
    if (!metric) {
      return observation;
    }

    return convertUnitForRolledUpByTimeObservation(value => convertToPreferredUnit(value, metric.measurementType))(
      observation
    );
  }

  // Apply unit conversions and no data
  const data = React.useMemo(() => {
    const convertedObservations = rawObservations?.map(convertObservation);

    if (!includeNoData) {
      return convertedObservations;
    }

    if (convertedObservations) {
      return getObservationsWithNoData({
        observations: convertedObservations,
        timeGranularity: timeGranularity.value,
      });
    }

    return undefined;
  }, [rawObservations, startDateTime, endDateTime, timeGranularity, includeNoData]);

  return { data, isLoading };
};
