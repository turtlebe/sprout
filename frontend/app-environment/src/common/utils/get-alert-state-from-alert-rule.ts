import { AlertRule, AlertState } from '@plentyag/core/src/types/environment';

/**
 * Return an {@link AlertState} for a given {@link AlertRule}.
 *
 * Returns AlertState.on by default.
 */
export function getAlertStateFromAlertRule(alertRule: AlertRule): AlertState {
  if (alertRule?.snoozedUntil && new Date(alertRule?.snoozedUntil) > new Date()) {
    return AlertState.snoozed;
  }
  if (alertRule?.isEnabled === false) {
    return AlertState.off;
  }

  if (alertRule?.isEnabled === true) {
    return AlertState.on;
  }

  return null;
}
