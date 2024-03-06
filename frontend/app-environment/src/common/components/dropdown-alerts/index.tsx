import { Notifications, NotificationsOff, NotificationsPaused } from '@material-ui/icons';
import { AlertStateIcon } from '@plentyag/app-environment/src/common/components/alert-state-icon';
import {
  dataTestIdsFormSnoozeAlerts,
  FormSnoozeAlerts,
} from '@plentyag/app-environment/src/common/components/form-snooze-alerts';
import { getAlertStateFromAlertRule, getAlertStateLabel } from '@plentyag/app-environment/src/common/utils';
import { Dropdown, DropdownItem, DropdownItemIcon, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { AlertRule, AlertState } from '@plentyag/core/src/types/environment';
import moment from 'moment';
import React from 'react';

const dataTestIds = {
  root: 'dropdown-alerts-root',
  on: 'dropdown-alerts-on',
  off: 'dropdown-alerts-off',
  snooze: 'dropdown-alerts-snooze',
  formSnooze: dataTestIdsFormSnoozeAlerts,
};

export { dataTestIds as dataTestIdsDropdownAlerts };

/** Allows the caller to use custom dataTestIds with a prefix and re-use those in tests. */
export function getDropdownAlertsDataTestIds(prefix = '') {
  const dataTestIdsWithPrefix = { ...dataTestIds };

  // add prefix to the default values of dataTestIds.
  Object.entries(dataTestIdsWithPrefix).forEach(([k, v]) => (dataTestIdsWithPrefix[k] = (prefix || '') + v));
  dataTestIdsWithPrefix.root = prefix || dataTestIds.root;
  return dataTestIdsWithPrefix;
}

export interface DropdownAlerts {
  alertRules: AlertRule[];
  onAlertRuleChanges: (alertRules: AlertRule[]) => void;
  defaultAlertRuleForUI?: AlertRule;
  'data-testid'?: string;
}

/**
 * Dropdown that allows to enable/disable/snooze AlertRules.
 *
 * - Enabled AlertRules will trigger notifications.
 * - Disabled AlertRules will NOT trigger notifications.
 * - Snoozed and Enabled AlertRules will NOT trigger notifications until the `snoozedUntil` attribute.
 *
 * This Dropdown configures AlertRules globally. It uses the first AlertRule or defaultAlertRuleForUI to render if the Alert for a Metric is enabled/disabled or snoozed.
 * When the user changes the Dropdown value, it will apply to all AlertRules passed as prop.
 */
export const DropdownAlerts: React.FC<DropdownAlerts> = ({
  alertRules = [],
  onAlertRuleChanges,
  defaultAlertRuleForUI,
  'data-testid': dataTestId,
}) => {
  const alertRuleForUI = defaultAlertRuleForUI !== undefined ? defaultAlertRuleForUI : alertRules[0];
  const [alertState, setAlertState] = React.useState<AlertState>(getAlertStateFromAlertRule(alertRuleForUI));
  const [label, setLabel] = React.useState<string>(getAlertStateLabel(alertRuleForUI));
  const [showFormSnoozeAlert, setShowFormSnoozeAlert] = React.useState<boolean>(false);

  React.useEffect(() => {
    setAlertState(getAlertStateFromAlertRule(alertRuleForUI));
    setLabel(getAlertStateLabel(alertRuleForUI));
  }, [alertRuleForUI]);

  function handleTurnAlertsOn() {
    const updatedAlertRules = [...alertRules.map(alertRule => ({ ...alertRule, isEnabled: true, snoozedUntil: null }))];

    setAlertState(AlertState.on);
    setLabel(getAlertStateLabel(updatedAlertRules[0]));
    onAlertRuleChanges(updatedAlertRules);
  }

  function handleTurnAlertsOff() {
    const updatedAlertRules = [
      ...alertRules.map(alertRule => ({ ...alertRule, isEnabled: false, snoozedUntil: null })),
    ];

    setAlertState(AlertState.off);
    setLabel(getAlertStateLabel(updatedAlertRules[0]));
    onAlertRuleChanges(updatedAlertRules);
  }

  function handleSubmitFormSnoozeAlert(snoozedUntil) {
    const updatedAlertRules = [
      ...alertRules.map(alertRule => ({ ...alertRule, isEnabled: true, snoozedUntil: moment(snoozedUntil).format() })),
    ];

    setAlertState(AlertState.snoozed);
    setLabel(getAlertStateLabel(updatedAlertRules[0]));
    setShowFormSnoozeAlert(false);
    onAlertRuleChanges(updatedAlertRules);
  }

  if (alertRules.length === 0) {
    return null;
  }

  const dataTestIdsWithPrefix = getDropdownAlertsDataTestIds(dataTestId);
  return showFormSnoozeAlert ? (
    <FormSnoozeAlerts onSubmit={handleSubmitFormSnoozeAlert} onCancel={() => setShowFormSnoozeAlert(false)} />
  ) : (
    <Dropdown
      color="default"
      label={label}
      startIcon={<AlertStateIcon alertState={alertState} />}
      data-testid={dataTestIdsWithPrefix.root}
    >
      <DropdownItem onClick={handleTurnAlertsOn} data-testid={dataTestIdsWithPrefix.on}>
        <DropdownItemIcon>
          <Notifications />
        </DropdownItemIcon>
        <DropdownItemText>Turn Alerts On</DropdownItemText>
      </DropdownItem>
      <DropdownItem onClick={handleTurnAlertsOff} data-testid={dataTestIdsWithPrefix.off}>
        <DropdownItemIcon>
          <NotificationsOff />
        </DropdownItemIcon>
        <DropdownItemText>Turn Alerts Off</DropdownItemText>
      </DropdownItem>
      <DropdownItem onClick={() => setShowFormSnoozeAlert(true)} data-testid={dataTestIdsWithPrefix.snooze}>
        <DropdownItemIcon>
          <NotificationsPaused />
        </DropdownItemIcon>
        <DropdownItemText>Snooze Alerts</DropdownItemText>
      </DropdownItem>
    </Dropdown>
  );
};
