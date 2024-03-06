import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { AlertRule, AlertState } from '@plentyag/core/src/types/environment';
import moment from 'moment';

/**
 * For a given {@link AlertRule}, return a label indicating if the AlertRule is enabled/disabled or snoozed.
 */
export function getAlertStateLabel(alertRule: AlertRule): string {
  if (alertRule?.snoozedUntil && new Date(alertRule?.snoozedUntil) > new Date()) {
    return `${AlertState.snoozed}: ${moment(alertRule.snoozedUntil).format(FORMAT)}`;
  }
  if (alertRule?.isEnabled === false) {
    return AlertState.off;
  }

  if (alertRule?.isEnabled === true) {
    return AlertState.on;
  }

  return null;
}
