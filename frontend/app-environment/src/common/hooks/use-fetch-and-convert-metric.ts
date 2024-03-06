import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { convertUnitForMetric, EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface UseFetchAndConvertMetricReturn extends UseSwrAxiosReturn<Metric> {}

/**
 * Fetch a Metric for the given metricId.
 *
 * This hook also takes care of converting the values of the Metric's unitConfig (min/max) and
 * the values of the included AlertRules to the user's preferred unit.
 */
export const useFetchAndConvertMetric = (metricId: string): UseFetchAndConvertMetricReturn => {
  const { convertToPreferredUnit } = useUnitConversion();
  const request = useSwrAxios<Metric, any>({ url: EVS_URLS.metrics.getByIdUrl(metricId, { includeAlertRules: true }) });

  const convertedMetric = React.useMemo(
    () =>
      request.data
        ? convertUnitForMetric(value => convertToPreferredUnit(value, request.data.measurementType))(request.data)
        : request.data,
    [request.data]
  );

  return { ...request, data: convertedMetric };
};
