import { MetricGraphNonNumerical } from '@plentyag/app-environment/src/common/components';
import {
  useFetchNonNumericalObservations,
  useLocalStorageDataInterpolation,
} from '@plentyag/app-environment/src/common/hooks';
import {
  COLORS,
  DEFAULT_TIME_GRANULARITY_NON_NUMERICAL as DEFAULT_TIME_GRANULARITY,
} from '@plentyag/app-environment/src/common/utils/constants';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric, TimeGranularity, TooltipPositioning } from '@plentyag/core/src/types/environment';
import React from 'react';

import { DashboardGraphLinks } from '..';

const dataTestIds = {};

export { dataTestIds as dataTestIdsDashboardGraphMetricNonNumerical };

export interface DashboardGraphMetricNonNumerical {
  metric: Metric;
  startDateTime: Date;
  endDateTime: Date;
  title: React.ReactNode;
  action: React.ReactNode;
  tooltipPositioning?: TooltipPositioning;
}

/**
 * Dashboard Graph for Non Numerical Metrics.
 */
export const DashboardGraphMetricNonNumerical: React.FC<DashboardGraphMetricNonNumerical> = ({
  metric,
  startDateTime,
  endDateTime,
  title,
  action,
  tooltipPositioning,
}) => {
  const [timeGranularity, setTimeGranularity] = React.useState<TimeGranularity>(DEFAULT_TIME_GRANULARITY);
  const {
    data: observations,
    isLoading,
    previousTimeGranularity,
  } = useFetchNonNumericalObservations({
    metric,
    startDateTime,
    endDateTime,
    timeGranularity,
  });
  const [valueAttribute, setValueAttribute] = React.useState<string>();
  const [dataInterpolation, setDataInterpolation] = useLocalStorageDataInterpolation({ id: metric.id });

  return (
    <Box>
      <MetricGraphNonNumerical
        title={title}
        action={action}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metric={metric}
        observations={observations}
        isEditing={false}
        isLoading={isLoading}
        height={200}
        previousTimeGranularity={previousTimeGranularity}
        timeGranularity={timeGranularity}
        valueAttribute={valueAttribute}
        dataInterpolation={dataInterpolation}
        onTimeGranularityChange={setTimeGranularity}
        onValueAttributeChange={setValueAttribute}
        onDataInterpolationChange={setDataInterpolation}
        tooltipPositioning={tooltipPositioning}
      >
        <DashboardGraphLinks metricsOrSchedules={[metric]} colors={[COLORS.dataNonNumerical]} />
      </MetricGraphNonNumerical>
    </Box>
  );
};
