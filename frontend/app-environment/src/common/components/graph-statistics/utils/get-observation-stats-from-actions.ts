import { getSetpointsUntilEndDateTime } from '@plentyag/app-environment/src/common/components/schedule-graph/hooks/use-graph-api/utils';
import { UseMetricScaleReturn } from '@plentyag/app-environment/src/common/hooks';
import { getActionAt } from '@plentyag/app-environment/src/common/utils';
import { ObservationStats, RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Action, Schedule, TimeSummarization } from '@plentyag/core/src/types/environment';
import { DateTime } from 'luxon';

import { getObservationStatsFromObservations } from './get-observation-stats-from-observations';

export interface GetActionsBetween {
  schedule: Schedule;
  startDateTime: Date;
  endDateTime: Date;
  x: UseMetricScaleReturn['x'];
  y: UseMetricScaleReturn['y'];
}
export function getActionsBetween({ schedule, startDateTime, endDateTime, x, y }: GetActionsBetween): Action<Date>[] {
  const actionAtStartDateTime = getActionAt(schedule, startDateTime);
  const actionAtEndDateTime = getActionAt(schedule, endDateTime);
  const luxonStartDateTime = DateTime.fromJSDate(startDateTime);
  const luxonEndDateTime = DateTime.fromJSDate(endDateTime);

  const actionsBetweenStartAndBeforeEndDateTime = getSetpointsUntilEndDateTime({
    schedule,
    startDateTime,
    endDateTime,
    x,
    y,
    isEditing: false,
  }).filter(action => {
    const actionDateTime = DateTime.fromJSDate(action.time);

    // Filter virtual points and actions that are not between startDateTime and endDateTime.
    //
    // `getSetpointsUntilEndDateTime` returns repeated intervals from startDateTime to endDateTime which
    // includes too many actions in this case.
    //
    // If startDateTime is after the beginning of the interval, the first action will be the beginning of the interval.
    // However we need the first action to be at startDateTime and not the beginning of the interval.
    return !action.isVirtual && actionDateTime > luxonStartDateTime && actionDateTime < luxonEndDateTime;
  });

  return [
    { ...actionAtStartDateTime, time: startDateTime },
    ...actionsBetweenStartAndBeforeEndDateTime,
    { ...actionAtEndDateTime, time: endDateTime },
  ];
}

export function getObservationsBetween(
  observations: RolledUpByTimeObservation[],
  _startDateTime: Date,
  _endDateTime: Date
): RolledUpByTimeObservation[] {
  const startDateTime = DateTime.fromJSDate(_startDateTime);
  const endDateTime = DateTime.fromJSDate(_endDateTime);

  return observations.filter(observation => {
    const rolledUpAt = DateTime.fromISO(observation.rolledUpAt);

    return startDateTime <= rolledUpAt && rolledUpAt <= endDateTime;
  });
}

export interface GetObservationStatsFromActions {
  schedule: Schedule;
  startDateTime: Date;
  endDateTime: Date;
  x: UseMetricScaleReturn['x'];
  y: UseMetricScaleReturn['y'];
  timeSummarization: TimeSummarization;
  observations: RolledUpByTimeObservation[];
}

export interface ObservationStatsWithAction {
  startDateTime: Date;
  endDateTime: Date;
  action: Action<Date>;
  observationStats: ObservationStats;
}

export function getObservationStatsFromActions({
  schedule,
  startDateTime,
  endDateTime: _endDateTime,
  x,
  y,
  observations,
  timeSummarization,
}: GetObservationStatsFromActions): ObservationStatsWithAction[] {
  if (!schedule) {
    return [];
  }

  const endDateTime = DateTime.fromJSDate(_endDateTime) > DateTime.now() ? DateTime.now().toJSDate() : _endDateTime;

  const actionsBeteweenStartAndEndDateTime = getActionsBetween({ schedule, startDateTime, endDateTime, x, y });

  return actionsBeteweenStartAndEndDateTime.slice(0, -1).map((action, index) => {
    const _startDateTime = action.time;
    const _endDateTime = actionsBeteweenStartAndEndDateTime[index + 1].time;
    const observationsSubset = getObservationsBetween(observations, _startDateTime, _endDateTime);
    const observationStats = getObservationStatsFromObservations(observationsSubset, timeSummarization);

    return {
      startDateTime: _startDateTime,
      endDateTime: _endDateTime,
      action,
      observationStats,
    };
  });
}
