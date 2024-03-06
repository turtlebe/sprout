import {
  DownloadData,
  getGraphTooltipDataTestIds,
  GraphLegend,
  GraphMetricsSettings,
  GraphSettings,
  GraphTooltip,
} from '@plentyag/app-environment/src/common/components';
import {
  useMetricGraphApi as useMetricGraphApi,
  useOptimalYAxis,
  UseRelatedMetricsAndObservationsReturn,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import {
  copySchedule,
  getColorGenerator,
  getGraphableActionDefinition,
  isNumericalMeasurementType,
} from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Card, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { useMeasure } from '@plentyag/core/src/hooks';
import { AlertRuleType, Schedule, TimeGranularity, TooltipPositioning } from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

import { useGraphApi, useMetricsGraphState, useScale } from './hooks';
import { getStartAndEndDateTime } from './utils';

const dataTestIds = {
  header: 'schedule-graph-header',
};

export { dataTestIds as dataTestIdsScheduleGraph };

export interface ScheduleGraph {
  title?: React.ReactNode;
  action?: React.ReactNode;
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
  relatedMetricsAndObservationsApi?: UseRelatedMetricsAndObservationsReturn;
  isEditing: boolean;
  onTimeGranularityChange: (timeGranularity: TimeGranularity) => void;
  onChange?: (updatedSchedule: Schedule) => void;
  height?: number;
  paddingBottom?: number;
  tooltipPositioning?: TooltipPositioning;
}

export const ScheduleGraph: React.FC<ScheduleGraph> = ({
  title,
  action,
  children,
  startDateTime: propStartDateTime,
  endDateTime: propEndDateTime,
  timeGranularity,
  schedule,
  scheduleDefinition,
  relatedMetricsAndObservationsApi,
  isEditing = false,
  onTimeGranularityChange,
  onChange,
  height,
  paddingBottom,
  tooltipPositioning,
}) => {
  // Miscellanous
  const { getPreferredUnit } = useUnitConversion();
  const unitSymbol = getPreferredUnit(
    getGraphableActionDefinition(scheduleDefinition).actionDefinition.measurementType
  ).symbol;
  const { startDateTime, endDateTime } = getStartAndEndDateTime({
    isEditing,
    startDateTime: propStartDateTime,
    endDateTime: propEndDateTime,
    schedule,
  });

  // Computed Properties
  const metricsWithObservations = React.useMemo(
    () =>
      relatedMetricsAndObservationsApi?.data?.filter(({ metric }) =>
        isNumericalMeasurementType(metric.measurementType)
      ) ?? [],
    [relatedMetricsAndObservationsApi]
  );
  const isValidating = React.useMemo(
    () => relatedMetricsAndObservationsApi?.isValidating,
    [relatedMetricsAndObservationsApi?.isValidating]
  );
  const metrics = React.useMemo(() => metricsWithObservations.map(({ metric }) => metric), [metricsWithObservations]);
  const observationStreams = React.useMemo(
    () => metricsWithObservations.map(({ observations }) => observations),
    [metricsWithObservations]
  );

  // States
  const [graphTooltipSelectors] = React.useState(getGraphTooltipDataTestIds(`graph-tooltip-${uuidv4()}`));
  const {
    state,
    setTimeSummarization,
    setShowAllData,
    setShowAllSpecLimits,
    setShowAllControlLimits,
    setShowData,
    setShowControlLimit,
    setShowSpecLimit,
  } = useMetricsGraphState({ metrics });

  // D3 related hooks
  const ref = React.useRef<SVGSVGElement>(null);
  const { min, max } = useOptimalYAxis({
    scheduleDefinitions: [scheduleDefinition],
    schedules: isEditing ? undefined : [schedule],
    metrics: isEditing ? undefined : metrics,
    observationStreams,
    timeSummarization: state.timeSummarization,
    buffer: isEditing ? 0 : undefined,
  });
  const refSize = useMeasure(ref);
  const scale = useScale({
    minY: min,
    maxY: max,
    scheduleDefinitions: [scheduleDefinition],
    width: refSize.width,
    height,
    startDateTime,
    endDateTime,
  });
  const chartApi = useGraphApi({ ref, scale, schedule });
  const metricGraphApi = useMetricGraphApi({ ref, scale });

  // Effects
  const d3RenderingDeps = [
    metricsWithObservations,
    startDateTime,
    endDateTime,
    schedule,
    scheduleDefinition,
    scale.minY,
    scale.maxY,
    scale.width,
    state.timeSummarization,
  ];

  React.useEffect(() => {
    chartApi.clear();
    chartApi.renderGraph({ unitSymbol, isEditing });
    metricGraphApi.renderTodaysLine({ isEditing });

    if (schedule) {
      if (isEditing) {
        chartApi.renderScheduleEditMode({
          schedule: copySchedule({ schedule }),
          scheduleDefinition,
          onChange,
          unitSymbol,
        });
      } else {
        chartApi.renderSchedule({ schedule, scheduleDefinition });

        const alertRuleColor = getColorGenerator();

        metricsWithObservations.forEach(metricWithObservations => {
          const [obserationColor, specLimitColor, controlLimitColor] = alertRuleColor.next().value;

          metricWithObservations.metric.alertRules.forEach(alertRule => {
            const pattern = [AlertRuleType.specLimit, AlertRuleType.specLimitDevices].includes(alertRule.alertRuleType)
              ? specLimitColor
              : controlLimitColor;
            metricGraphApi.renderAlertRule({ alertRule, options: { pattern, visibility: 'hidden' } });
          });

          metricGraphApi.renderObservations({
            observations: metricWithObservations.observations,
            metric: metricWithObservations.metric,
            color: obserationColor,
            timeSummarization: state.timeSummarization,
          });
        });

        chartApi.renderMouseOverEffect({
          schedule,
          scheduleDefinition,
          metricsWithObservations,
          unitSymbol,
          graphTooltipSelectors,
          timeSummarization: state.timeSummarization,
          tooltipPositioning,
        });
      }
    }
  }, d3RenderingDeps);

  React.useEffect(() => {
    Object.keys(state.metrics).forEach(metricId => {
      const metric = metrics.find(metric => metric.id === metricId);
      metricGraphApi.updateAlertRule({
        metric,
        alertRuleType: AlertRuleType.specLimit,
        show: state.metrics[metricId].showSpecLimit,
      });
      metricGraphApi.updateAlertRule({
        metric,
        alertRuleType: AlertRuleType.specLimitDevices,
        show: state.metrics[metricId].showSpecLimit,
      });
      metricGraphApi.updateAlertRule({
        metric,
        alertRuleType: AlertRuleType.controlLimit,
        show: state.metrics[metricId].showControlLimit,
      });
      metricGraphApi.updateObservations({
        metric,
        show: state.metrics[metricId].showData,
        graphTooltipSelectors,
      });
    });
  }, [...d3RenderingDeps, state.metrics]);

  return (
    <Card>
      <Box position="relative">
        <Show when={Boolean(title)}>
          <CardHeader title={title} data-testid={dataTestIds.header} action={action} />
        </Show>
        <Box paddingX={2} paddingBottom={paddingBottom}>
          <GraphSettings
            isLoading={isValidating}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            onTimeGranularityChanged={onTimeGranularityChange}
            onTimeSummarizationChanged={setTimeSummarization}
            right={action ? '3rem' : undefined}
            downloadIcon={
              <Show when={metricsWithObservations.length > 0}>
                <DownloadData
                  metrics={metrics}
                  schedule={schedule}
                  observations={observationStreams}
                  disabled={isValidating}
                  startDateTime={startDateTime}
                  endDateTime={endDateTime}
                />
              </Show>
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
            schedule={schedule}
            scheduleDefinition={scheduleDefinition}
            metricsWithObservations={metricsWithObservations}
          />
        </Box>
        {children}
      </Box>
      <GraphTooltip
        data-testid={graphTooltipSelectors.root}
        schedule={schedule}
        scheduleDefinition={scheduleDefinition}
        metricsWithObservations={metricsWithObservations}
      />
    </Card>
  );
};
