import { UseRelatedMetricsAndObservationsReturn } from '@plentyag/app-environment/src/common/hooks';
import { Box, Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { AlertRule, Metric, Schedule } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import moment from 'moment-timezone';
import React from 'react';

import { LegendColor } from '..';
import {
  adjustColor,
  getActionDefinitions,
  getAlertRuleTypeLabel,
  getBackgroundColorsForAlertRuleType,
  getCommonParentPath,
  getLinearGradientRotate,
  getScheduleColorGenerator,
} from '../../utils';
import { COLORS } from '../../utils/constants';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    alertRule: (alertRule: AlertRule) => `alert-rule-${alertRule.id}`,
    buttonMetric: (metric: Metric) => `button-metric-${metric.id}`,
    data: 'data',
    metric: (metric: Metric) => `metric-with-obs-${metric.id}`,
    schedule: (schedule: Schedule) => `metric-with-schedule-${schedule.id}`,
    scheduleDefinition: (key: string) => `schedule-definition-${key}`,
  },
  'graph-legend'
);

export { dataTestIds as dataTestIdsGraphLegend };

export interface GraphLegend {
  alertRules?: AlertRule[];
  observations?: RolledUpByTimeObservation[];
  schedule?: Schedule;
  schedules?: Schedule[];
  scheduleDefinition?: ScheduleDefinition;
  metricsWithObservations?: UseRelatedMetricsAndObservationsReturn['data'];
  selectedMetric?: Metric;
  onSelectMetric?: (metric: Metric) => void;
}

/**
 * GraphLegend iterates over many Ev2 objects, AlertRules, Schedules, Observations and render a colored legend to help
 * the user understand what they are visualizing.
 */
export const GraphLegend: React.FC<GraphLegend> = ({
  alertRules,
  observations,
  schedule,
  scheduleDefinition,
  schedules,
  metricsWithObservations,
  selectedMetric,
  onSelectMetric,
}) => {
  const classes = useStyles({});
  const scheduleColorGenerator = getScheduleColorGenerator();
  const { remainingPaths: schedulesRemaingPaths } = getCommonParentPath(schedules);
  const { remainingPaths: metricsRemaingPaths } = getCommonParentPath(
    metricsWithObservations?.map(({ metric }) => metric)
  );

  const MetricLegend = ({ path, metric, colors }) => (
    <Box display="flex" alignItems="center" padding={1} data-testid={dataTestIds.metric(metric)} gridGap="0.5rem">
      <LegendColor backgroundColor={colors[0]} />
      {path} - {metric?.observationName}
    </Box>
  );

  return (
    <Grid container>
      <Grid item xs={10}>
        <Box display="flex" flexWrap="wrap" data-testid={dataTestIds.root}>
          {alertRules &&
            alertRules.map(alertRule => (
              <Box
                key={alertRule.id}
                display="flex"
                alignItems="center"
                padding={1}
                data-testid={dataTestIds.alertRule(alertRule)}
              >
                <LegendColor
                  borderColor={getBackgroundColorsForAlertRuleType(alertRule.alertRuleType)[0]}
                  backgroundColorLinearGradient={getBackgroundColorsForAlertRuleType(alertRule.alertRuleType)}
                  linearGradientRotate={getLinearGradientRotate(alertRule.alertRuleType)}
                />
                <Box padding={0.5} />
                {getAlertRuleTypeLabel(alertRule.alertRuleType)}
              </Box>
            ))}
          {observations && (
            <Box display="flex" alignItems="center" padding={1} data-testid={dataTestIds.data}>
              <LegendColor backgroundColor={COLORS.data} />
              <Box padding={0.5} />
              Data
            </Box>
          )}
          {schedule &&
            scheduleDefinition &&
            getActionDefinitions(scheduleDefinition, { graphable: true }).map(({ key }, index) => (
              <Box
                key={key ?? ''}
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                padding={1}
                data-testid={dataTestIds.scheduleDefinition(key)}
              >
                <LegendColor backgroundColor={adjustColor(COLORS.schedule, index)} />
                <Box padding={0.5} />
                Schedule {key}
              </Box>
            ))}
          {schedules &&
            schedules.map((schedule, index) => (
              <Box
                key={schedule.id}
                display="flex"
                alignItems="center"
                padding={1}
                data-testid={dataTestIds.schedule(schedule)}
              >
                <LegendColor backgroundColor={scheduleColorGenerator.next().value} />
                <Box padding={0.5} />
                {schedulesRemaingPaths[index]}
              </Box>
            ))}
          {metricsWithObservations &&
            metricsWithObservations.map(({ metric, colors }, index) =>
              onSelectMetric ? (
                <button
                  key={metric.id}
                  className={classes.clickableMetric}
                  aria-selected={metric.id === selectedMetric?.id}
                  onClick={() => onSelectMetric(metric)}
                  data-testid={dataTestIds.buttonMetric(metric)}
                >
                  <MetricLegend path={metricsRemaingPaths[index]} metric={metric} colors={colors} />
                </button>
              ) : (
                <MetricLegend path={metricsRemaingPaths[index]} key={metric.id} metric={metric} colors={colors} />
              )
            )}
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
          <Typography variant="caption" color="textSecondary">
            Timezone: {moment.tz.guess()}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
