import { getEditModeStartDateTime } from '@plentyag/app-environment/src/common/utils';
import { AlertRule } from '@plentyag/core/src/types/environment';
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
   * AlertRules to consider in edit mode to determine startDateTime and endDateTime.
   */
  alertRules: AlertRule[];

  /**
   * The TabId that contains the AlertRule ID currently being edited.
   */
  currentTabId: string;

  /**
   * Whether or not the MetricPage is in EditMode.
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
 * When editing, we want to lock the Time Window of the MetricPage to the AlertRule being edited:
 * - The startDateTime should be the startsAt of the AlertRule.
 * - The endDateTime should be the time when the first interval ends.
 */
export function getStartAndEndDateTime({
  isEditing,
  startDateTime,
  endDateTime,
  alertRules,
  currentTabId,
}: GetStartAndEndDateTime): GetStartAndEndDateTimeReturn {
  if (!isEditing) {
    return { startDateTime, endDateTime };
  }

  const alertRuleEdited = alertRules.find(alertRule => alertRule.id === currentTabId);

  const { repeatInterval } = alertRuleEdited;

  const startsAt = getEditModeStartDateTime(alertRuleEdited);
  const endsAt = moment(startsAt).add(repeatInterval, 'seconds');

  return {
    startDateTime: startsAt.toDate(),
    endDateTime: endsAt.toDate(),
  };
}
