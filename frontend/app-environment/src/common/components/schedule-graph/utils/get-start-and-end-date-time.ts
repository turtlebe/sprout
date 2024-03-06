import { getEditModeStartDateTime } from '@plentyag/app-environment/src/common/utils';
import { Schedule } from '@plentyag/core/src/types/environment';
import moment from 'moment';

interface GetStartAndEndDateTime {
  /**
   * This prop should come from the startDateTime value of WindowDateTimePicker.
   */
  startDateTime: Date;

  /**
   * This prop should come from the endDateTime value of WindowDateTimePicker.
   */
  endDateTime: Date;

  /**
   * Schedule to consider in edit mode to determine startDateTime and endDateTime.
   */
  schedule: Schedule;

  /**
   * Whether or not the SchedulePage is in EditMode.
   */
  isEditing: boolean;
}

interface GetStartAndEndDateTimeReturn {
  startDateTime: Date;
  endDateTime: Date;
}

/**
 * When not editing, this function simply returns the passed startDateTime and endDateTime.
 *
 * When editing, we want to lock the Time Window of the SchedulePage to the Schedule:
 * - The startDateTime is the startsAt of the Schedule.
 * - The endDateTime is be the time when the first interval ends.
 */
export function getStartAndEndDateTime({
  isEditing,
  startDateTime,
  endDateTime,
  schedule,
}: GetStartAndEndDateTime): GetStartAndEndDateTimeReturn {
  if (!isEditing) {
    return { startDateTime, endDateTime };
  }

  const startsAt = getEditModeStartDateTime(schedule);
  const endsAt = moment(startsAt).add(schedule.repeatInterval, 'seconds');

  return {
    startDateTime: startsAt.toDate(),
    endDateTime: endsAt.toDate(),
  };
}
