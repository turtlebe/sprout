import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  convertUnitForObservationStats,
  getSearchObservationStatsUrl,
} from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { ObservationStats } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { axiosRequest, getArrayWithUpdatedIndex } from '@plentyag/core/src/utils';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { AxiosRequestConfig } from 'axios';
import React from 'react';

export interface GetAxiosRequestParams {
  metric: Metric;
  startDateTime: Date;
  endDateTime: Date;
}

export function getAxiosRequestParams({
  metric,
  startDateTime,
  endDateTime,
}: GetAxiosRequestParams): AxiosRequestConfig {
  return {
    url: getSearchObservationStatsUrl(),
    method: 'POST',
    data: {
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      path: metric.path,
      measurementType: metric.measurementType,
      observationName: metric.observationName,
    },
  };
}

export interface UseFetchAndConvertObservationStats {
  metric: Metric;
  primary: { startDateTime: Date; endDateTime: Date };
  secondary: { startDateTime: Date; endDateTime: Date }[];
  fetchData: boolean;
}

export interface UseFetchAndConvertObservationStatsReturn {
  primary: { observationStats: ObservationStats; isLoading: boolean };
  secondary: { observationStats: ObservationStats; isLoading: boolean }[];
}

/**
 * Fetch and convert Observation Stats for a a primary date range and a secondary array of date ranges.
 */
export const useFetchAndConvertObservationStats = ({
  metric,
  primary,
  secondary,
  fetchData,
}: UseFetchAndConvertObservationStats): UseFetchAndConvertObservationStatsReturn => {
  const snackbar = useGlobalSnackbar();
  const { convertToPreferredUnit } = useUnitConversion();
  const [primaryState, setPrimaryState] = React.useState<UseFetchAndConvertObservationStatsReturn['primary']>({
    observationStats: null,
    isLoading: false,
  });
  const [secondaryState, setSecondaryState] = React.useState<UseFetchAndConvertObservationStatsReturn['secondary']>([]);

  const getConvertedObservationStats = (observationStats: ObservationStats) =>
    convertUnitForObservationStats(value => convertToPreferredUnit(value, metric.measurementType))(observationStats);
  const errorHandler = error => {
    const message = parseErrorMessage(error);
    snackbar.errorSnackbar({ message });
  };

  // Fetch ObservationStats for primary data
  React.useEffect(() => {
    if (!fetchData) {
      return;
    }

    setPrimaryState(previousPrimary => ({ ...previousPrimary, isLoading: true }));

    void axiosRequest<ObservationStats>(getAxiosRequestParams({ metric, ...primary }))
      .then(response => {
        const observationStats = getConvertedObservationStats(response.data);

        setPrimaryState({ observationStats, isLoading: false });
      })
      .catch(error => {
        errorHandler(error);

        setPrimaryState(previousPrimary => ({ ...previousPrimary, isLoading: false }));
      });
  }, [metric, primary.startDateTime, primary.endDateTime, fetchData]);

  // Fetch ObservationStats for secondary data
  React.useEffect(() => {
    if (!fetchData) {
      return;
    }

    setSecondaryState(secondary.map(() => ({ observationStats: null, isLoading: true })));

    secondary.forEach(async ({ startDateTime, endDateTime }, index) =>
      axiosRequest<ObservationStats>(getAxiosRequestParams({ metric, startDateTime, endDateTime }))
        .then(response => {
          const observationStats = getConvertedObservationStats(response.data);

          setSecondaryState(previousSecondary =>
            getArrayWithUpdatedIndex(previousSecondary, { observationStats, isLoading: false }, index)
          );
        })
        .catch(error => {
          errorHandler(error);

          setSecondaryState(previousSecondary =>
            getArrayWithUpdatedIndex(previousSecondary, { ...previousSecondary[index], isLoading: false }, index)
          );
        })
    );
  }, [metric, secondary, fetchData]);

  return { primary: primaryState, secondary: secondaryState };
};
