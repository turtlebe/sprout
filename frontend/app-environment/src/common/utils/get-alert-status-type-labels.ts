import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { AlertRule, AlertState, AlertStatusType } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { getAlertStateFromAlertRule } from './get-alert-state-from-alert-rule';

export function getAlertStatusTypeLabels(alertRules: AlertRule[]) {
  const subscriptionTypeMap = new Map<string, { count: number; snoozedUntil?: string }>();

  alertRules.forEach((alertRule: AlertRule) => {
    const alertRuleState = getAlertStateFromAlertRule(alertRule);
    if (alertRuleState === AlertState.snoozed) {
      subscriptionTypeMap.set(AlertStatusType.snoozed, {
        count: subscriptionTypeMap.get(AlertStatusType.snoozed)?.count + 1 || 1,
        snoozedUntil: alertRule.snoozedUntil,
      });
    } else {
      const statusType = alertRule.isEnabled ? AlertStatusType.on : AlertStatusType.off;
      subscriptionTypeMap.set(statusType, {
        count: subscriptionTypeMap.get(statusType)?.count + 1 || 1,
      });
    }
  });

  // Return with alert status type count in parenthesis e.g.(2), if count > 1
  // Also for 'Snoozed' status only display 'until {time}' legend when count == 1, otherwise just diplsay count in parenthesis
  return [...subscriptionTypeMap.entries()]
    .map(([key, value]: [string, any]) => {
      if (key == AlertStatusType.snoozed) {
        return value.count > 1
          ? `${key} (${value.count})`
          : `${key} until ${moment(value.snoozedUntil).format(FORMAT)}`;
      } else {
        return value.count > 1 ? `${key} (${value.count})` : `${key}`;
      }
    })
    .join(', ');
}
