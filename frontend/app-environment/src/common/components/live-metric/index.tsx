import {
  getLiveStatusIconDataTestIds,
  LiveStatusIcon,
} from '@plentyag/app-environment/src/common/components/live-status-icon';
import {
  useFetchAndConvertObservations,
  useGetLiveStatusColor,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import {
  convertUnitForMetric,
  formatNumericalValue,
  isNumericalMetric,
} from '@plentyag/app-environment/src/common/utils';
import { DEFAULT_TIME_GRANULARITY } from '@plentyag/app-environment/src/common/utils/constants';
import { CircularProgressCentered, Show, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Card, CardContent, CardHeader, Tab, Tabs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { AlertRuleLiveGraph, LiveAlertRuleNonNumerical, LiveObservationsGraph } from './components';
import { useGetAlertRulesWithStatus } from './hooks';
import { useStyles } from './styles';

const dataTestIds = {
  root: (metric: Metric) => `card-metric-root-${metric.id}`,
  loader: 'card-metric-loader',
  value: 'card-metric-value',
  metricStatus: getLiveStatusIconDataTestIds('metric-status'),
  alertRuleTab: (alertRule: AlertRule) => `card-metric-alert-rule-tab-${alertRule.id}`,
  alertRuleStatus: (alertRule: AlertRule) => getLiveStatusIconDataTestIds('alert-rule-status-' + alertRule.id),
};

export { dataTestIds as dataTestIdsLiveMetric };

export interface LiveMetric {
  metric: Metric;
  startDateTime: Date;
  endDateTime: Date;
  inGrid?: boolean;
  action?: React.ReactNode;
}

/**
 * Card showing a live view of the Metric.
 *
 * This Card render two D3 graphs:
 * - The first graph renders the data stream with observations for the last 2 hours.
 * - For each alert rule we render a live view of it based on the latest observation.
 *
 * The Card shows if the current Metric is within range, out of range or if the data is missing.
 */
export const LiveMetric: React.FC<LiveMetric> = ({
  metric: metricProp,
  startDateTime,
  endDateTime,
  inGrid,
  action,
}) => {
  // Styles
  const classes = useStyles({});

  // Unit Conversion
  const { getPreferredUnit, convertToPreferredUnit } = useUnitConversion();
  const metric = React.useMemo(
    () =>
      metricProp &&
      convertUnitForMetric(value => convertToPreferredUnit(value, metricProp.measurementType))(metricProp),
    [metricProp]
  );
  const unitSymbol = getPreferredUnit(metric.measurementType).symbol;

  // Data from ODS
  const timeGranularity = DEFAULT_TIME_GRANULARITY;
  const timeSummarization = TimeSummarization.mean;
  const { data = [], isLoading } = useFetchAndConvertObservations({
    metric,
    startDateTime,
    endDateTime,
    timeGranularity,
  });
  const observation = data[data.length - 1];

  // State + Computed Properties
  const [currentTab = false, setCurrentTab] = React.useState<AlertRule['id']>();
  const observationValue = observation ? observation[timeSummarization] : undefined;
  const { alertRules, metricStatus } = useGetAlertRulesWithStatus({ metric, endDateTime, observationValue });
  const color = useGetLiveStatusColor(metricStatus);

  React.useEffect(() => {
    // Set the first triggered AlertRule as the current tab
    if (alertRules.length) {
      setCurrentTab(alertRules[0].id);
    }
  }, [alertRules?.length]);

  return (
    <Card className={inGrid ? undefined : classes.card} data-testid={dataTestIds.root(metric)}>
      <CardHeader
        avatar={<LiveStatusIcon status={metricStatus} data-testid={dataTestIds.metricStatus.root} />}
        action={action}
        title={metric.observationName}
        subheader={getShortenedPath(metric.path)}
        classes={{ content: classes.wordBreak }}
      />
      <CardContent>
        <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ display: isLoading ? 'none' : undefined }}
          >
            <Box display="flex" justifyContent="center">
              <Typography variant="h4" style={{ color }} data-testid={dataTestIds.value}>
                {observation ? formatNumericalValue(observation[timeSummarization], unitSymbol) : 'No Data'}
              </Typography>
            </Box>
            <LiveObservationsGraph
              metric={metric}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              data={data}
              timeSummarization={timeSummarization}
              unitSymbol={unitSymbol}
              color={color}
            />
          </Box>
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            classes={{ indicator: classes.tabsIndicator }}
          >
            {alertRules.map(alertRule => (
              <Tab
                key={alertRule.id}
                value={alertRule.id}
                aria-label={alertRule.alertRuleType}
                classes={{ root: classes.tabRoot }}
                data-testid={dataTestIds.alertRuleTab(alertRule)}
                icon={
                  <LiveStatusIcon
                    status={alertRule.status}
                    data-testid={dataTestIds.alertRuleStatus(alertRule).root}
                    fontSize="small"
                  />
                }
              />
            ))}
          </Tabs>
          <Box display="flex" justifyContent="center">
            {alertRules.map(alertRule => (
              <TabPanel key={alertRule.id} index={alertRule.id} value={currentTab}>
                {isNumericalMetric(metric) ? (
                  <AlertRuleLiveGraph
                    alertRule={alertRule}
                    observationValue={observationValue}
                    unitSymbol={unitSymbol}
                    endDateTime={endDateTime}
                  />
                ) : (
                  <LiveAlertRuleNonNumerical
                    alertRule={alertRule}
                    endDateTime={endDateTime}
                    status={alertRule.status}
                  />
                )}
              </TabPanel>
            ))}
          </Box>
        </Show>
      </CardContent>
    </Card>
  );
};
