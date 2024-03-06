import { Check } from '@material-ui/icons';
import { ChipMetric } from '@plentyag/app-environment/src/common/components/chip-metric';
import { DropdownAlerts } from '@plentyag/app-environment/src/common/components/dropdown-alerts';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { dataTestIdsDialogDefault, DialogDefault, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box, Button, DialogContent, Paper } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { AlertRule, Metric, Widget } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import { cloneDeep, isEqual, uniqBy } from 'lodash';
import React from 'react';

import { DashboardAlertRuleHeader } from './components';
import { getAlertRulesWithUpdatedStatus } from './utils/';

const dataTestIds = {
  close: dataTestIdsDialogDefault.close,
  content: 'dialog-dashboard-alert-rules-content',
  dialog: 'dialog-dashboard-alert-rules-dialog',
  header: 'dialog-dashboard-alert-rules-header',
  save: 'dialog-dashboard-alert-rules-save',
  metricAlerts: (index: number) => `dialog-dashboard-metric-${index}-alert-rules`,
  metricAlertsDropdown: (index: number) => `dialog-dashboard-metric-${index}-alert-rules-dropdown`,
};

export { dataTestIds as dataTestIdsDialogDashboardAlertRules };

export interface DialogDashboardAlertRules {
  widgets: Widget[];
  open: boolean;
  onClose: () => void;
  onDashboardUpdated: () => void;
  dataTestId?: string;
}

/**
 * This Dialog lets the user manage the alerting statuses of the Alert Rules associated with the Dashboard's Metrics.
 *
 */
export const DialogDashboardAlertRules: React.FC<DialogDashboardAlertRules> = ({
  widgets = [],
  open,
  onClose,
  onDashboardUpdated,
  dataTestId,
}) => {
  const [coreState] = useCoreStore();
  const { makeRequest } = usePutRequest({ url: EVS_URLS.alertRules.bulkUpdateUrl() });
  const snackbar = useGlobalSnackbar();
  const [saveButtonDisabled, setSaveButtonDisabled] = React.useState<boolean>(true);

  function getMetricsWithAlertRules(widgets: Widget[]): Metric[] {
    return uniqBy(
      widgets.flatMap(widget =>
        widget.items.filter(item => item.metric && item.metric.alertRules.length > 0).map(item => item.metric)
      ) || [],
      metric => metric.id
    );
  }

  // Maintains state of all metrics associated with dashboard items, as user changes states on UI
  const [metricsWithAlertRules, setMetricsWithAlertRules] = React.useState<Metric[]>(getMetricsWithAlertRules(widgets));

  // Keep all alert rules associated with dashboard items
  const allAlertRules = metricsWithAlertRules.flatMap(metric => metric.alertRules);
  // Keep original state of all metric alert rules associated with dashboard items, needed for delta changes when update is sent to the backend
  const originalAlertRules = getMetricsWithAlertRules(widgets).flatMap(metric => metric.alertRules);

  React.useEffect(() => {
    const _metricsWithAlertRules = getMetricsWithAlertRules(widgets);
    if (isEqual(metricsWithAlertRules, _metricsWithAlertRules)) {
      return;
    }
    setMetricsWithAlertRules(_metricsWithAlertRules);
  }, [widgets]);

  // Save alert states on the back-end with metricsWithAlertRules state
  const handleSave = () => {
    // Get updated alert rules first, we don't wan't to send every rule to the back-end that hasn't changed and ding the updatedBy field if no changes have taken place on it
    const updatedAlertRules = getAlertRulesWithUpdatedStatus(originalAlertRules, allAlertRules);

    makeRequest({
      data: {
        requests: updatedAlertRules.map(alertRule => ({ ...alertRule, updatedBy: coreState.currentUser.username })),
      },
      onSuccess: () => {
        snackbar.successSnackbar('Alerting configuration successfully updated.');
        onDashboardUpdated();
      },
      onError: error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ message });
      },
    });
  };

  // Updates alert rule states locally
  const handleUpdate = (modifiedAlertRules: AlertRule[]) => {
    const newMetricsWithAlertRules = cloneDeep(metricsWithAlertRules);

    const newState = newMetricsWithAlertRules.map(metric => {
      return {
        ...metric,
        alertRules: metric.alertRules.map(alertRule => {
          const modifiedAlertRule = modifiedAlertRules.find(a => a.id === alertRule.id);
          return modifiedAlertRule || alertRule;
        }),
      };
    });
    setMetricsWithAlertRules(newState);
    // With a rule to update, enable save button
    setSaveButtonDisabled(false);
  };

  return (
    <DialogDefault
      open={open}
      data-testid={dataTestId}
      onClose={onClose}
      maxWidth="lg"
      title="Edit Dashboard Alerts (On/Off/Snooze)"
    >
      <DialogContent data-testid={dataTestIds.content}>
        <DashboardAlertRuleHeader
          data-testid={dataTestIds.header}
          alerts={allAlertRules}
          onHeaderAlertRuleChanges={handleUpdate}
        />
        {metricsWithAlertRules.map((metric, index) => (
          <Paper
            variant="outlined"
            data-testid={dataTestIds.metricAlerts(index)}
            key={metric.id}
            style={{ marginTop: '0.5rem' }}
          >
            <Box display="flex" justifyContent="space-between" padding={2}>
              <ChipMetric metric={metric} />
              <Box display="flex" flexDirection="column">
                <DropdownAlerts
                  alertRules={metric.alertRules}
                  onAlertRuleChanges={handleUpdate}
                  data-testid={dataTestIds.metricAlertsDropdown(index)}
                />
              </Box>
            </Box>
          </Paper>
        ))}
      </DialogContent>
      <Box display="flex" justifyContent="center" padding={2}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<Check />}
          onClick={handleSave}
          data-testid={dataTestIds.save}
          disabled={saveButtonDisabled}
        >
          Save
        </Button>
      </Box>
    </DialogDefault>
  );
};
