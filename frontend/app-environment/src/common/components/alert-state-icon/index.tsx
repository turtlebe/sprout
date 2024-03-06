import { Notifications, NotificationsOff, NotificationsPaused } from '@material-ui/icons';
import { AlertState } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  on: 'alert-state-icon-on',
  off: 'alert-state-icon-off',
  snoozed: 'alert-state-icon-snoozed',
};

export { dataTestIds as dataTestIdsAlertStateIcon };

export interface AlertStateIcon {
  alertState: AlertState;
}

/**
 * Returns an Icon based on {@link AlertState}
 */
export const AlertStateIcon: React.FC<AlertStateIcon> = ({ alertState }) => {
  if (alertState === AlertState.snoozed) {
    return <NotificationsPaused data-testid={dataTestIds.snoozed} />;
  }
  if (alertState === AlertState.off) {
    return <NotificationsOff data-testid={dataTestIds.off} />;
  }

  return <Notifications data-testid={dataTestIds.on} />;
};
