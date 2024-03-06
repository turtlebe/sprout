import {
  dataTestIdsGraphLegend,
  dataTestIdsGraphStatistics,
  DownloadData,
  getGraphTooltipDataTestIds,
  GraphLegend,
  GraphMetricsSettings,
  GraphSettings,
  GraphStatistics,
  GraphTooltip,
} from '@plentyag/app-environment/src/common/components';
import {
  useDashboardGraphState,
  useFetchObservations,
  useLocalStorageTimeGranularity,
  useMetricGraphApi,
  useMetricScale,
  useOptimalYAxis,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Card, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefMeasurementType } from '@plentyag/core/src/farm-def/types';
import { useMeasure } from '@plentyag/core/src/hooks';
import { AlertRuleType, Dashboard, Metric, TooltipPositioning } from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

import { DashboardGraphLinks, WarningMultipleMeasurementTypes } from '..';

import { useStyles } from './styles';

const dataTestIds = {
  graphLegend: dataTestIdsGraphLegend,
  graphStatistics: dataTestIdsGraphStatistics,
};

export { dataTestIds as dataTestIdsDashboardGraphMetrics };

export interface DashboardGraphMetrics {
  dashboard: Dashboard;
  measurementType: FarmDefMeasurementType;
  metrics: Metric[];
  startDateTime: Date;
  endDateTime: Date;
  title: React.ReactNode;
  action: React.ReactNode;
  tooltipPositioning: TooltipPositioning;
}

/**
 * Graph for a specific MeasurementType and its associated Metrics.
 *
 * This component lazy load the observations data and displays them.
 *
 * It also provides links to each individual Metric Pages.
 *
 * coming: It lets the user pick and choose what they want to display on the graph.
 */
export const DashboardGraphMetrics: React.FC<DashboardGraphMetrics> = ({
  dashboard,
  measurementType,
  metrics,
  startDateTime,
  endDateTime,
  title,
  action,
  tooltipPositioning,
}) => {
  // Miscellanous
  const classes = useStyles({});
  const { getPreferredUnit } = useUnitConversion();
  const unitSymbol = getPreferredUnit(measurementType).symbol;

  // States
  const [graphTooltipSelectors] = React.useState(getGraphTooltipDataTestIds(`graph-tooltip-${uuidv4()}`));
  const [timeGranularity, setTimeGranularity] = useLocalStorageTimeGranularity({ startDateTime, endDateTime });
  const [selectedMetric, setSelectedMetric] = React.useState<Metric>();
  const {
    state,
    setTimeSummarization,
    setShowAllData,
    setShowAllSpecLimits,
    setShowAllControlLimits,
    setShowData,
    setShowControlLimit,
    setShowSpecLimit,
  } = useDashboardGraphState({ dashboard, metrics, measurementType: measurementType.key });

  // Fetch Data
  const { data: metricsWithObservations = [], isValidating } = useFetchObservations({
    metrics,
    startDateTime,
    endDateTime,
    timeGranularity,
  });

  // Computed
  const selectedMetricsWithObservation = React.useMemo(
    () => metricsWithObservations.find(({ metric }) => metric.id === selectedMetric?.id),
    [metricsWithObservations, selectedMetric]
  );

  // D3 related Hooks
  const { min, max } = useOptimalYAxis({
    metrics,
    observationStreams: metricsWithObservations.map(({ observations }) => observations),
    timeSummarization: state.timeSummarization,
  });
  const ref = React.useRef<SVGSVGElement>(null);
  const refSize = useMeasure(ref);
  const scale = useMetricScale({
    minY: min,
    maxY: max,
    width: refSize.width,
    height: 200,
    startDateTime,
    endDateTime,
  });
  const chartApi = useMetricGraphApi({ ref, scale });

  // Effects
  React.useEffect(() => {
    chartApi.clear();
    chartApi.renderGraph({ unitSymbol, xTicks: 5, yTicks: 4 });
    chartApi.renderTodaysLine({});

    metricsWithObservations.forEach(metricWithObservations => {
      chartApi.renderObservations({
        observations: metricWithObservations.observations,
        color: metricWithObservations.colors[0],
        metric: metricWithObservations.metric,
        timeSummarization: state.timeSummarization,
      });
    });

    metricsWithObservations
      .filter(({ metric }) => metric.measurementType === measurementType.key)
      .forEach(({ metric, colors }) => {
        metric.alertRules.forEach(alertRule => {
          if (
            [AlertRuleType.specLimit, AlertRuleType.specLimitDevices].includes(alertRule.alertRuleType) &&
            state.metrics[metric.id].showSpecLimit
          ) {
            chartApi.renderAlertRule({ alertRule, options: { pattern: colors[1] } });
          }
          if (alertRule.alertRuleType === AlertRuleType.controlLimit && state.metrics[metric.id].showControlLimit) {
            chartApi.renderAlertRule({ alertRule, options: { pattern: colors[2] } });
          }
        });
      });

    chartApi.renderMouseOverEffect({
      metricsWithObservations,
      unitSymbol,
      graphTooltipSelectors,
      timeSummarization: state.timeSummarization,
      tooltipPositioning,
    });
  }, [scale.minY, scale.maxY, scale.width, metricsWithObservations, state.timeSummarization]);

  React.useEffect(() => {
    Object.keys(state.metrics).forEach(metricId => {
      const metric = metrics.find(metric => metric.id === metricId);
      chartApi.updateAlertRule({
        metric,
        alertRuleType: AlertRuleType.specLimit,
        show: state.metrics[metricId].showSpecLimit,
      });
      chartApi.updateAlertRule({
        metric,
        alertRuleType: AlertRuleType.specLimitDevices,
        show: state.metrics[metricId].showSpecLimit,
      });
      chartApi.updateAlertRule({
        metric,
        alertRuleType: AlertRuleType.controlLimit,
        show: state.metrics[metricId].showControlLimit,
      });
      chartApi.updateObservations({
        metric,
        show: state.metrics[metricId].showData,
        graphTooltipSelectors,
      });
    });
  }, [state]);

  return (
    <Card>
      <Box position="relative">
        <CardHeader title={title} action={action} classes={{ title: classes.title }} />
        <Box paddingX={2}>
          <WarningMultipleMeasurementTypes metrics={metrics} />
          <GraphSettings
            isLoading={isValidating}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            onTimeGranularityChanged={setTimeGranularity}
            onTimeSummarizationChanged={setTimeSummarization}
            right={action ? '3rem' : undefined}
            downloadIcon={
              <DownloadData
                metrics={metricsWithObservations.map(({ metric }) => metric)}
                observations={metricsWithObservations.map(({ observations }) => observations)}
                dashboard={dashboard}
                widgetName={title.toString()}
                disabled={isValidating}
                startDateTime={startDateTime}
                endDateTime={endDateTime}
              />
            }
          >
            <GraphMetricsSettings
              metrics={metrics}
              state={state}
              onShowAllData={setShowAllData}
              onShowAllSpecLimits={setShowAllSpecLimits}
              onShowAllControlLimits={setShowAllControlLimits}
              onShowSpecLimit={setShowSpecLimit}
              onShowData={setShowData}
              onShowControlLimit={setShowControlLimit}
            />
          </GraphSettings>

          <Box flex="1 1 0" display="flex" justifyContent="center" flexDirection="column" overflow="hidden">
            <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} />
          </Box>

          <GraphLegend
            metricsWithObservations={metricsWithObservations}
            onSelectMetric={metric => setSelectedMetric(metric)}
            selectedMetric={selectedMetric}
          />

          <Show when={Boolean(selectedMetricsWithObservation)}>
            <GraphStatistics
              margin="0.5rem 0"
              isLoading={isValidating}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              x={scale.x}
              y={scale.y}
              color={selectedMetricsWithObservation?.colors[0]}
              metric={selectedMetricsWithObservation?.metric}
              observations={selectedMetricsWithObservation?.observations}
              timeSummarization={state.timeSummarization}
            />
          </Show>
        </Box>
        <DashboardGraphLinks metricsOrSchedules={metrics} />
      </Box>
      <GraphTooltip metricsWithObservations={metricsWithObservations} data-testid={graphTooltipSelectors.root} />
    </Card>
  );
};
