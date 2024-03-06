import { Warning as WarningIcon } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    warningIcon: 'warning-icon',
  },
  'tab-label-alert-events'
);

export { dataTestIds as dataTestIdsTabLabelAlertEvents };

export interface TabLabelAlertEvents {
  hasActiveAlertEvents: boolean;
}

/**
 * Label for a Tab with content related to Alert Events.
 */
export const TabLabelAlertEvents: React.FC<TabLabelAlertEvents> = ({ hasActiveAlertEvents }) => {
  return (
    <Box data-testid={dataTestIds.root} display="flex" alignItems="center">
      Alerts
      <Show when={hasActiveAlertEvents}>
        <Box padding={1} />
        <WarningIcon style={{ color: 'orange' }} data-testid={dataTestIds.warningIcon} />
      </Show>
    </Box>
  );
};
