import { Delete, Link } from '@material-ui/icons';
import {
  useFetchAndConvertObservationStats,
  UseMetricScaleReturn,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import { DialogSchedulePicker, Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, Chip, IconButton, Paper, Switch } from '@plentyag/brand-ui/src/material-ui/core';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, Schedule, TimeSummarization } from '@plentyag/core/src/types/environment';
import {
  DateTimeFormat,
  getChildFarmDefObject,
  getLastPathSegmentFromStringPath,
  getScopedDataTestIds,
} from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { LegendColor, LiveActionValue } from '..';
import { convertUnitForSchedule } from '../../utils';
import { COLORS } from '../../utils/constants';

import { getObservationStatisticsDataTestIds, ObservationStatistics } from './components';
import { getObservationStatsFromActions, getObservationStatsFromObservations } from './utils';

const dataTestIds = getScopedDataTestIds(
  {
    metricStats: (metric: Metric) => getObservationStatisticsDataTestIds(`metric-${metric.id}`),
    actionStats: (actionIndex: number) => getObservationStatisticsDataTestIds(`action-${actionIndex}`),
    rawDataSwitch: 'switch',
  },
  'graph-statistics'
);

export { dataTestIds as dataTestIdsGraphStatistics };

export interface GraphStatistics {
  isLoading: boolean;
  startDateTime: Date;
  endDateTime: Date;
  x: UseMetricScaleReturn['x'];
  y: UseMetricScaleReturn['y'];
  metric: Metric;
  observations: RolledUpByTimeObservation[];
  timeSummarization: TimeSummarization;
  color?: string;
  margin?: React.CSSProperties['margin'];
}

/**
 * GraphStatistics based on RolledUpByTimeObservation or ObservationStats
 */
export const GraphStatistics: React.FC<GraphStatistics> = ({
  isLoading: isCallerLoading,
  startDateTime,
  endDateTime,
  x,
  y,
  metric,
  observations: unboundObservations,
  timeSummarization,
  color = COLORS.data,
  margin,
}) => {
  // misc hooks
  const { getPreferredUnit, convertToPreferredUnit } = useUnitConversion();

  // states
  const [schedule, setSchedule] = React.useState<Schedule>();
  const [scheduleDefition, setScheduleDefinition] = React.useState<ScheduleDefinition>();
  const [showRawDataStats, setShowRawDataStats] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  // memo
  const observations = React.useMemo(
    () => unboundObservations.filter(observation => new Date(observation.rolledUpAt) >= startDateTime),
    [unboundObservations]
  );
  const unitSymbol = React.useMemo(() => getPreferredUnit(metric.measurementType).symbol, [metric.measurementType]);
  const observationStatsFromObservations = React.useMemo(
    () => getObservationStatsFromObservations(observations, timeSummarization),
    [observations, timeSummarization]
  );
  const observationStatsWithActions = React.useMemo(
    () =>
      getObservationStatsFromActions({ schedule, startDateTime, endDateTime, x, y, observations, timeSummarization }),
    [schedule, startDateTime, endDateTime, x, y, observations, timeSummarization]
  );

  // fetch raw data
  const { primary, secondary } = useFetchAndConvertObservationStats({
    metric,
    primary: { startDateTime, endDateTime },
    secondary: observationStatsWithActions,
    fetchData: showRawDataStats,
  });

  // handlers
  const handlPickSchedule: DialogSchedulePicker['onChange'] = ({ schedule, farmDefObject }) => {
    const scheduleDefinition = getChildFarmDefObject<ScheduleDefinition>(farmDefObject, schedule.path);
    const convertedSchedule = convertUnitForSchedule((value, actionDefinition) =>
      convertToPreferredUnit(value, actionDefinition.measurementType)
    )(schedule, scheduleDefinition);
    setSchedule(convertedSchedule);
    setScheduleDefinition(scheduleDefinition);
    setOpen(false);
  };

  return (
    <Paper variant="outlined" style={{ margin }} data-testid={dataTestIds.root}>
      <Box display="flex" alignItems="center" justifyContent="space-between" padding={1}>
        <Box display="flex" alignItems="center" gridGap="0.5rem">
          <LegendColor backgroundColor={color} />
          <ObservationStatistics
            observationStats={showRawDataStats ? primary.observationStats : observationStatsFromObservations}
            isLoading={isCallerLoading || primary.isLoading}
            unitSymbol={unitSymbol}
            data-testid={dataTestIds.metricStats(metric).root}
          />
        </Box>
        <Box display="flex" alignItems="center" gridGap="0.5rem">
          <Show
            when={!Boolean(schedule)}
            fallback={
              <Button startIcon={<Delete />} onClick={() => setSchedule(null)}>
                {getLastPathSegmentFromStringPath(schedule?.path)}
              </Button>
            }
          >
            <IconButton icon={Link} onClick={() => setOpen(true)} />
          </Show>
          <DialogSchedulePicker open={open} onChange={handlPickSchedule} onClose={() => setOpen(false)} />
          <Box>
            <Switch
              checked={showRawDataStats}
              onChange={() => setShowRawDataStats(!showRawDataStats)}
              data-testid={dataTestIds.rawDataSwitch}
            />{' '}
            Raw Data
          </Box>
        </Box>
      </Box>

      <Box paddingX={1}>
        {observationStatsWithActions.map((observationStatsWithAction, index) => (
          <Box key={index} display="flex" alignItems="center" gridGap="0.5rem" paddingBottom={1}>
            <Chip
              label={
                <Box display="flex" alignItems="center" gridGap="0.5rem">
                  <span>
                    {DateTime.fromJSDate(observationStatsWithAction.startDateTime).toFormat(DateTimeFormat.US_DEFAULT)}
                    &nbsp;-&nbsp;
                    {DateTime.fromJSDate(observationStatsWithAction.endDateTime).toFormat(DateTimeFormat.US_DEFAULT)}
                  </span>
                  <LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefition} color="inherit" />
                </Box>
              }
            />

            <ObservationStatistics
              observationStats={
                showRawDataStats ? secondary[index]?.observationStats : observationStatsWithAction.observationStats
              }
              unitSymbol={unitSymbol}
              isLoading={isCallerLoading || secondary[index]?.isLoading}
              data-testid={dataTestIds.actionStats(index).root}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
