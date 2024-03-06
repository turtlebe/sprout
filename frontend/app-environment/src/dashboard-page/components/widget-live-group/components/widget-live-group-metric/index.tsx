import { LiveRuleValue } from '@plentyag/app-environment/src/common/components';
import { useConverter, useFetchAndConvertObservations } from '@plentyag/app-environment/src/common/hooks';
import { DEFAULT_TIME_GRANULARITY } from '@plentyag/app-environment/src/common/utils/constants';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { Show, UnstyledLink } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric, TabType } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    loader: 'loader',
    observationName: 'observation-name',
  },
  'widgetLiveGroupMetric'
);

export { dataTestIds as dataTestIdsWidgetLiveGroupMetric };

export interface WidgetLiveGroupMetric {
  metric: Metric;
  options: { alertRuleId?: string };
}

export const WidgetLiveGroupMetric: React.FC<WidgetLiveGroupMetric> = ({ metric: metricProp, options = {} }) => {
  const startDateTime = React.useMemo(() => DateTime.now().minus({ hour: 2 }).toJSDate(), []);
  const endDateTime = React.useMemo(() => DateTime.now().toJSDate(), []);

  const { metric } = useConverter({ metric: metricProp });
  const alertRule = React.useMemo(
    () => metric.alertRules.find(alertRule => alertRule.id === options.alertRuleId),
    [metric, options.alertRuleId]
  );

  // Data from ODS
  const { data = [], isLoading } = useFetchAndConvertObservations({
    metric,
    startDateTime,
    endDateTime,
    timeGranularity: DEFAULT_TIME_GRANULARITY,
  });

  const observation = data[data.length - 1];

  return (
    <Box display="flex" justifyContent="space-between" data-testid={dataTestIds.root}>
      <UnstyledLink
        to={alertRule ? PATHS.metricPageTab(metric.id, TabType.alertRule, alertRule?.id) : PATHS.metricPage(metric.id)}
      >
        <Tooltip title={getShortenedPath(metric.path)}>
          <Typography variant="subtitle2" color="textSecondary" data-testid={dataTestIds.observationName}>
            {metric.observationName}
          </Typography>
        </Tooltip>
      </UnstyledLink>
      <Show when={!isLoading} fallback={<CircularProgress size="12px" data-testid={dataTestIds.loader} />}>
        <LiveRuleValue metric={metric} alertRule={alertRule} at={endDateTime} observation={observation} />
      </Show>
    </Box>
  );
};
