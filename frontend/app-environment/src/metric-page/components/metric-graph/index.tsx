import {
  DownloadData,
  getGraphTooltipDataTestIds,
  GraphLegend,
  GraphSettings,
  GraphStatistics,
  GraphTooltip,
} from '@plentyag/app-environment/src/common/components';
import { useGraphApi as useScheduleGraphApi } from '@plentyag/app-environment/src/common/components/schedule-graph/hooks';
import {
  UseFetchAndConvertObservationsReturn,
  useLocalStorageTimeSummarization,
  useMetricGraphApi,
  useMetricScale,
  useOptimalYAxis,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import { isNumericalMetric } from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Card } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { useMeasure } from '@plentyag/core/src/hooks';
import {
  AlertEvent,
  AlertRule,
  Metric,
  Schedule,
  TimeGranularity,
  TooltipPositioning,
} from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

import { copyAlertRule } from '../../utils';

import { getStartAndEndDateTime } from './utils';

const dataTestIds = {};

export { dataTestIds as dataTestIdsMetricGraph };

export interface MetricGraph {
  startDateTime: Date;
  endDateTime: Date;
  timeGranularity: TimeGranularity;
  alertRules?: AlertRule[];
  alertEvents?: AlertEvent[];
  schedule?: Schedule;
  scheduleDefinition?: ScheduleDefinition;
  observationsRequest: UseFetchAndConvertObservationsReturn;
  metric: Metric;
  isEditing?: boolean;
  currentTab?: string;
  onTimeGranularityChange: (timeGranularity: TimeGranularity) => void;
  onChange?: (updatedAlertRule: AlertRule) => void;
  tooltipPositioning?: TooltipPositioning;
}

export const MetricGraph: React.FC<MetricGraph> = ({
  startDateTime: propStartDateTime,
  endDateTime: propEndDateTime,
  timeGranularity,
  alertRules = [],
  alertEvents = [],
  schedule,
  scheduleDefinition,
  observationsRequest,
  isEditing = false,
  metric,
  currentTab = '',
  tooltipPositioning = TooltipPositioning.default,
  onTimeGranularityChange = () => {},
  onChange = () => {},
}) => {
  // Miscellanous
  const [, currentTabId] = currentTab.split(',');
  const { getPreferredUnit } = useUnitConversion();
  const unitSymbol = getPreferredUnit(metric.measurementType).symbol;
  const { startDateTime, endDateTime } = getStartAndEndDateTime({
    isEditing,
    startDateTime: propStartDateTime,
    endDateTime: propEndDateTime,
    alertRules,
    currentTabId,
  });

  // States
  const [timeSummarization, setTimeSummarization] = useLocalStorageTimeSummarization();
  const [graphTooltipSelectors] = React.useState(getGraphTooltipDataTestIds(`graph-tooltip-${uuidv4()}`));

  // Data
  const { data: observations = [], isLoading: isObservationsLoading } = observationsRequest;

  // D3 related hooks
  const { min, max } = useOptimalYAxis({
    metrics: [metric],
    alertRules,
    observationStreams: [observations],
    schedules: [schedule],
    scheduleDefinitions: [scheduleDefinition],
    timeSummarization,
  });
  const ref = React.useRef<SVGSVGElement>(null);
  const refSize = useMeasure(ref);
  const scale = useMetricScale({
    minY: min,
    maxY: max,
    width: refSize.width,
    startDateTime,
    endDateTime,
  });
  const chartApi = useMetricGraphApi({ ref, scale });
  const scheduleGraphApi = useScheduleGraphApi({ ref, scale });

  // Effects
  React.useEffect(() => {
    chartApi.clear();
    chartApi.renderGraph({ unitSymbol, isEditing });
    chartApi.renderTodaysLine({ isEditing });

    if (isEditing) {
      const editableAlertRules = alertRules.filter(
        alertRule => alertRule.rules && alertRule.rules.length > 0 && currentTabId === alertRule.id
      );
      const readOnlyAlertRules = alertRules.filter(
        alertRule => alertRule.rules && alertRule.rules.length > 0 && currentTabId !== alertRule.id
      );

      readOnlyAlertRules.forEach(alertRule => {
        chartApi.renderAlertRule({ alertRule, options: { opacity: 0.3 } });
      });

      // Render the editable shapes last so that it's draggable and not burried under other shapes.
      chartApi.renderObservations({ observations, metric, timeSummarization });
      editableAlertRules.forEach(alertRule => {
        chartApi.renderAlertRuleEditMode({
          alertRule: copyAlertRule({ alertRule }),
          onChange,
          unitSymbol,
        });
      });
    } else {
      alertRules.forEach(alertRule => chartApi.renderAlertRule({ alertRule }));

      if (schedule && scheduleDefinition) {
        scheduleGraphApi.renderSchedule({ schedule, scheduleDefinition });
      }

      chartApi.renderObservations({ observations, metric, timeSummarization });
      chartApi.renderAlertEvents({ observations, alertEvents, timeSummarization });
      chartApi.renderMouseOverEffect({
        observations,
        alertRules,
        unitSymbol,
        schedule,
        scheduleDefinition,
        graphTooltipSelectors,
        timeSummarization,
        tooltipPositioning,
      });
    }
  }, [
    scale.minY,
    scale.maxY,
    scale.width,
    startDateTime,
    endDateTime,
    alertRules,
    alertEvents,
    schedule,
    scheduleDefinition,
    observations,
    isEditing,
    currentTabId,
    timeSummarization,
    timeGranularity,
  ]);

  return (
    <Card>
      <Box padding={2} position="relative">
        <GraphSettings
          isLoading={isObservationsLoading}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          timeGranularity={timeGranularity}
          onTimeGranularityChanged={onTimeGranularityChange}
          onTimeSummarizationChanged={setTimeSummarization}
          downloadIcon={
            <DownloadData
              metrics={[metric]}
              observations={[observations]}
              disabled={isObservationsLoading}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
            />
          }
        />

        <Box flex="1 1 0" display="flex" justifyContent="center" flexDirection="column" overflow="hidden">
          <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} />
        </Box>

        <GraphLegend
          alertRules={alertRules}
          observations={observations}
          schedule={schedule}
          scheduleDefinition={scheduleDefinition}
        />
        <Show when={Boolean(!isEditing && metric && isNumericalMetric(metric))}>
          <GraphStatistics
            isLoading={isObservationsLoading}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            x={scale.x}
            y={scale.y}
            metric={metric}
            observations={observations}
            timeSummarization={timeSummarization}
          />
        </Show>
      </Box>
      <GraphTooltip
        alertRules={alertRules}
        observations={observations}
        schedule={schedule}
        scheduleDefinition={scheduleDefinition}
        data-testid={graphTooltipSelectors.root}
      />
    </Card>
  );
};
