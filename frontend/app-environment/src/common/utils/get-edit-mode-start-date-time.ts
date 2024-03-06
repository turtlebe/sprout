import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';

import { getIntervalStartWithoutDst, getPreviousIntervalStart, isDstInInterval } from '.';

/**
 * When editing an Alert Rule or a Schedule, we would like to have the `startDateTime` to be the the start of the previous interval.
 *
 * This allows us to fetch data for the previous interval and display it against the edited AlertRule/Schedule on the D3 chart. This helps the
 * user and gives them a sense of the data in order to configure AlertRule/Schedule accordingly.
 *
 * If we were to use the current interval, we would only have data up to now, which is insufficient to render data across an entire interval.
 *
 * /!\ During DST, this feature is potentially disabled. If the current interval or the previous interval is impacted by DST, we rely on
 * `getIntervalStartWithoutDst` to calculate the StartDateTime to avoid ambuigity and display bugs with time.
 */
export function getEditModeStartDateTime(alertRuleOrSchedule: AlertRule | Schedule): moment.Moment {
  const now = new Date();
  const { isDstTransition: isDstInCurrentInterval } = isDstInInterval(alertRuleOrSchedule, now);
  const { isDstTransition: isDstInPreviousInterval } = isDstInInterval(alertRuleOrSchedule, now, -1);

  return isDstInCurrentInterval || isDstInPreviousInterval
    ? getIntervalStartWithoutDst(alertRuleOrSchedule)
    : getPreviousIntervalStart(alertRuleOrSchedule);
}
