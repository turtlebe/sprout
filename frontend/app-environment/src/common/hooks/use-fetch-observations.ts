import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  convertUnitForRolledUpByTimeObservation,
  getColorGenerator,
  getObservationsWithNoData,
} from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { UNPAGINATE_DEFAULT_LIMIT, UNPAGINATE_URL } from '@plentyag/core/src/hooks';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, TimeGranularity } from '@plentyag/core/src/types/environment';
import { axiosRequest, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseFetchObservations {
  metrics: Metric[];
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
}

export interface UseFetchObservationsReturn {
  data: { metric: Metric; observations: RolledUpByTimeObservation[]; colors: string[] }[];
  error: any;
  isValidating: boolean;
}

/**
 * Sub-hook called by {@see useRelatedMetricsAndObservations}.
 *
 * Returns the relevant {@link RolledUpByTimeObservation}s given an array of {@link Metric}.
 *
 * For each Metric, we make a query to ODS (in fact more than one because of pagination) and we
 * map the response with its respective Metric.
 */
export const useFetchObservations = ({
  metrics,
  startDateTime,
  endDateTime,
  timeGranularity,
}: UseFetchObservations): UseFetchObservationsReturn => {
  const [data, setData] = React.useState<UseFetchObservationsReturn['data']>();
  const [error, setError] = React.useState<UseFetchObservationsReturn['error']>();
  const [isValidating, setIsValidating] = React.useState<boolean>(false);
  const snackbar = useGlobalSnackbar();
  const { convertToPreferredUnit } = useUnitConversion();
  const colorGenerator = getColorGenerator();

  React.useEffect(() => {
    if (!metrics) {
      return;
    }

    setIsValidating(true);

    void Promise.all(
      metrics.map(async metric =>
        axiosRequest<RolledUpByTimeObservation[]>({
          method: 'POST',
          url: UNPAGINATE_URL,
          data: {
            serviceName: 'observation-digest-service',
            operation: 'search-rolled-up-by-time-observations',
            bodyRequest: {
              path: metric.path,
              measurementType: metric.measurementType,
              observationName: metric.observationName,
              startDateTime: startDateTime.toISOString(),
              endDateTime: endDateTime.toISOString(),
              order: 'asc',
              timeGranularity: timeGranularity.value,
              limit: UNPAGINATE_DEFAULT_LIMIT,
            },
          },
        }).then(response => {
          return { ...response, metric };
        })
      )
    )
      .then(responses => {
        const metricsWithObservations = responses.map(response => {
          const convertFunction = value => convertToPreferredUnit(value, response.metric.measurementType);
          const convertedObservations = response.data.map(convertUnitForRolledUpByTimeObservation(convertFunction));
          const convertedObservationsWithNoData = getObservationsWithNoData({
            observations: convertedObservations,
            timeGranularity: timeGranularity.value,
          });

          return {
            metric: response.metric,
            observations: convertedObservationsWithNoData,
            colors: colorGenerator.next().value,
          };
        });

        setData(metricsWithObservations);
      })
      .catch(error => {
        snackbar.errorSnackbar({ title: 'Failed to fetch data.', message: parseErrorMessage(error) });
        setError(error);
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [metrics, startDateTime, endDateTime, timeGranularity.value]);

  return { data, error, isValidating };
};
