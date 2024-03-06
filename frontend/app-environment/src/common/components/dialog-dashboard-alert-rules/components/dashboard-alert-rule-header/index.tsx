import { ErrorOutline } from '@material-ui/icons';
import { DropdownAlerts } from '@plentyag/app-environment/src/common/components/dropdown-alerts';
import { getAlertStateFromAlertRule } from '@plentyag/app-environment/src/common/utils/get-alert-state-from-alert-rule';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Chip, Paper, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  headerAlertRules: 'header-dialog-alert-rules',
  headerNoAlertRules: 'header-dialog-no-alert-rules',
  headerNoAlertRulesMessage: 'header-dialog-no-alert-rules-message',
  headerDropdown: 'header-dialog-dropdown-alert-rules',
};

export { dataTestIds as dataTestIdsDashboardAlertRuleHeader };

export interface DashboardAlertRuleHeader {
  alerts: AlertRule[];
  onHeaderAlertRuleChanges: (rulesToUpdate: AlertRule[]) => void;
}

/**
 * Component that renders AlertRule headers for Dashboard
 *
 */
export const DashboardAlertRuleHeader: React.FC<DashboardAlertRuleHeader> = ({ alerts, onHeaderAlertRuleChanges }) => {
  // Get all alert states (On/off/snoozed date) from alert rule, to set header defaultAlertRuleForUI if all equal
  const allAlertRuleStates = new Set(
    alerts.map(alert => {
      return getAlertStateFromAlertRule(alert);
    })
  );

  // Determine if all alert states from dashboard alerts are the same, if so, we have a default value for global selector, otherwise null default
  const defaultAlertRuleForUI = allAlertRuleStates.size == 1 ? [...alerts][0] : null;

  return (
    <Paper variant="outlined">
      <Show
        when={alerts.length > 0}
        fallback={
          <Box display="flex" justifyContent="center" padding={2} data-testid={dataTestIds.headerNoAlertRules}>
            <ErrorOutline />
            <Box padding={0.25} />
            <Typography data-testid={dataTestIds.headerNoAlertRulesMessage}>
              The Metrics associated with this Dashboard have no alert rules.
            </Typography>
          </Box>
        }
      >
        <Box display="flex" justifyContent="space-between" padding={2} data-testid={dataTestIds.headerAlertRules}>
          <Chip label="All Metrics" color="secondary" />

          {/* Leverage pre-existing component, designed for array of alertRules */}
          <DropdownAlerts
            alertRules={alerts}
            onAlertRuleChanges={onHeaderAlertRuleChanges}
            defaultAlertRuleForUI={defaultAlertRuleForUI}
            data-testid={dataTestIds.headerDropdown}
          />
        </Box>
      </Show>
    </Paper>
  );
};
