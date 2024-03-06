import { UseMetricGraphApi } from '@plentyag/app-environment/src/common/hooks';
import {
  getIntervalWithStepInterpolation,
  padIntervalSchedule,
  repeatInterval,
} from '@plentyag/app-environment/src/common/utils';
import { Action, InterpolationType, Schedule } from '@plentyag/core/src/types/environment';

export interface GetSetpointsFromStartToEnd {
  schedule: Schedule;
  startDateTime: Date;
  endDateTime: Date;
  x: UseMetricGraphApi['scale']['x'];
  y: UseMetricGraphApi['scale']['y'];
  isEditing?: boolean;
}

/**
 * Given a Schedule's Setpoints, generate all the Setpoints since the beginning of the Schedule and repeat them until endDateTime.
 *
 * Transforms the Setpoints with a time in seconds since interval to a Setpoint with an actual Datetime to make plotting easier in D3.
 *
 * Filter out all the Setpoints outside of startEndDateTime (-1 interval) and endDateTime (+1 interval).
 *
 * This function is explained in details on this confluence page:
 * https://plentyag.atlassian.net/wiki/spaces/EN/pages/2060976395/How+do+we+plot+an+AlertRule+without+interpolation
 */
export const getSetpointsUntilEndDateTime = ({
  schedule,
  startDateTime,
  endDateTime,
  x,
  y,
  isEditing = false,
}: GetSetpointsFromStartToEnd): Action<Date>[] => {
  const actionsPadded =
    schedule.interpolationType === InterpolationType.linear
      ? padIntervalSchedule({ schedule, x, y })
      : getIntervalWithStepInterpolation(padIntervalSchedule({ schedule, x, y }));

  return repeatInterval({
    rulesOrActions: actionsPadded,
    alertRuleOrSchedule: schedule,
    startDateTime,
    endDateTime,
    isEditing,
  });
};
