import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { AlertRule, Metric, Schedule, TimeSummarization } from '@plentyag/core/src/types/environment';
import React from 'react';

import {
  getActionsMinMax,
  getObservationStreamsMinMax,
  getRulesMinMax,
  getScheduleDefinitionsMinMax,
  getUnitConfigMinMax,
} from './utils';

export interface UseOptimalYAxis {
  metrics?: Metric[];
  alertRules?: AlertRule[];
  scheduleDefinitions?: ScheduleDefinition[];
  schedules?: Schedule[];
  observationStreams?: RolledUpByTimeObservation[][];
  timeSummarization?: TimeSummarization;
  /**
   * The buffer will decrease/increase the min/max value by a certain percentage.
   *
   * It allows giving padding so that objects drawn are not at the edge of the chart.
   */
  buffer?: number;
}

export const DEFAULT_BUFFER = 0.05;

export interface UseOptimalYAxisReturn {
  min: number;
  max: number;
}

export const useOptimalYAxis = ({
  metrics = [],
  alertRules = [],
  schedules = [],
  scheduleDefinitions = [],
  observationStreams = [],
  timeSummarization,
  buffer = DEFAULT_BUFFER,
}: UseOptimalYAxis): UseOptimalYAxisReturn => {
  // Calculate Min/Max for ObservationStreams
  const { min: observationStreamsMin, max: observationStreamsMax } = React.useMemo(
    () => getObservationStreamsMinMax(observationStreams, timeSummarization),
    [observationStreams, timeSummarization]
  );

  // Calculate Min/Max for AlertRules' Rules
  const { min: alertRulesMin, max: alertRulesMax } = React.useMemo(
    () => getRulesMinMax(metrics, alertRules),
    [alertRules]
  );

  // Calculate Min/Max for Schedules' Actions
  const { min: schedulesMin, max: schedulesMax } = React.useMemo(
    () => getActionsMinMax(schedules, scheduleDefinitions),
    [schedules, scheduleDefinitions]
  );

  // Calculate Min/Max for Metric's UnitConfigs
  const { min: unitConfigMin, max: unitConfigMax } = React.useMemo(() => getUnitConfigMinMax(metrics), [metrics]);

  // Calculate Min/Max for ScheduleDefitions
  const { min: scheduleDefinitionsMin, max: scheduleDefinitionsMax } = React.useMemo(
    () => getScheduleDefinitionsMinMax(scheduleDefinitions),
    [scheduleDefinitions]
  );

  // Step 1: First, consider only ObservationStreams, Rules and Actions to determine optimal Y-Axis Min and Max
  let mins = [observationStreamsMin, alertRulesMin, schedulesMin].filter(number => !Number.isNaN(number));
  let maxs = [observationStreamsMax, alertRulesMax, schedulesMax].filter(number => !Number.isNaN(number));

  if (mins.length && maxs.length) {
    const min = Math.min(...mins);
    const max = Math.max(...maxs);
    const padding = (max - min) * buffer;

    return { min: min - padding, max: max + padding };
  }

  // Step 2: If we didn't get a Min/Max from ObservationStreams, Rules and Actions only,
  // now consider the less optimal UnitConfigs and ScheduleDefinitions.
  mins = [unitConfigMin, scheduleDefinitionsMin].filter(number => !Number.isNaN(number));
  maxs = [unitConfigMax, scheduleDefinitionsMax].filter(number => !Number.isNaN(number));

  if (mins.length && maxs.length) {
    const min = Math.min(...mins);
    const max = Math.max(...maxs);
    const padding = (max - min) * buffer;

    return { min: min - padding, max: max + padding };
  }

  // Step 3: Lastly, if we couldn't find a Min/Max at Step 1 or 2, then default to 0 - 100
  return { min: 0, max: 100 };
};
