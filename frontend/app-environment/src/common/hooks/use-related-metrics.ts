import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { convertUnitForMetric, EVS_URLS, isObservableEqual } from '@plentyag/app-environment/src/common/utils';
import { ObservationSelector } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { uniq } from 'lodash';
import React from 'react';

export interface UseRelatedMetrics {
  observationSelectors: ObservationSelector[];
}

export interface UseRelatedMetricsReturn {
  data: Metric[];
  isValidating: boolean;
}

/**
 * Sub-hook called by {@link useRelatedMetricsAndObservations}.
 *
 * Returns the relevant {@link Metric}s given an array of {@link ObservationSelector}.
 *
 * This is done through one query. We search for Metrics with all the paths, measurementTypes and observationNames. Then we filter the Metrics
 * returned matching the ObservationSelectors.
 */
export const useRelatedMetrics = ({ observationSelectors }: UseRelatedMetrics): UseRelatedMetricsReturn => {
  const metricSearchParams = React.useMemo(() => {
    if (!observationSelectors) {
      return undefined;
    }

    return {
      paths: uniq(observationSelectors.map(observationSelector => observationSelector.path)),
      measurementTypes: uniq(observationSelectors.map(observationSelector => observationSelector.measurementType)),
      observationNames: uniq(observationSelectors.map(observationSelector => observationSelector.observationName)),
    };
  }, [observationSelectors]);
  const { convertToPreferredUnit } = useUnitConversion();

  const {
    data: metrics,
    isValidating,
    error,
  } = useSwrAxios<PaginatedList<Metric>>(
    metricSearchParams &&
      observationSelectors.length > 0 && {
        url: EVS_URLS.metrics.searchUrl(),
        method: 'POST',
        // We might hit the limit one day.
        // Rebuild /unpaginate endpoint with swagger and use it here.
        data: { ...metricSearchParams, includeAlertRules: true, limit: 1000 },
      }
  );
  useLogAxiosErrorInSnackbar(error);

  const relatedMetrics = React.useMemo(() => {
    if (!metrics) {
      return undefined;
    }

    return observationSelectors
      .map(observationSelector => metrics.data.find(isObservableEqual(observationSelector)))
      .filter(m => m)
      .map(metric => {
        const convertFunction = value => convertToPreferredUnit(value, metric.measurementType);

        return convertUnitForMetric(convertFunction)(metric);
      });
  }, [observationSelectors, metrics]);

  return {
    data: relatedMetrics,
    isValidating,
  };
};
