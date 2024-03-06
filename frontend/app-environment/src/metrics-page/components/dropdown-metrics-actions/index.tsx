import {
  FileCopyOutlined,
  InfoOutlined,
  Notifications,
  NotificationsOff,
  NotificationsPaused,
} from '@material-ui/icons';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import {
  DialogBaseForm,
  DialogConfirmation,
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemText,
  getDialogConfirmationDataTestIds,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { usePutRequest, useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import { BulkApplyWorkflow, Metric } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { uniq } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { DialogExportAsDashboard } from '../dialog-export-as-dashboard';

import { useAlertRulesSnoozeFormGenConfig } from './hooks/use-alert-rules-snooze-form-gen-config';

enum DialogType {
  turnOnAlertRules = 'TURN_ON_ALERT_RULES',
  turnOffAlertRules = 'TURN_OFF_ALERT_RULES',
  snoozeAlertRules = 'SNOOZE_ALERT_RULES',
  exportAsDashoard = 'EXPORT_AS_DASHBOARD',
}

const dataTestIds = getScopedDataTestIds(
  {
    bulkApply: 'item-bulk-apply',
    bulkApplyIcon: 'item-bulk-apply-icon',
    bulkApplyIconDisabled: 'item-bulk-apply-icon-disabled',
    dialogAlertRulesOff: getDialogConfirmationDataTestIds('alert-rules-off-dialog'),
    dialogAlertRulesOn: getDialogConfirmationDataTestIds('alert-rules-on-dialog'),
    dialogAlertRulesOnRoot: 'alert-rules-on-dialog-root',
    dialogAlertRulesSnooze: 'alert-rules-snooze-dialog',
    exportAsDashboard: 'export-to-dashboard',
    exportAsDashboardIcon: 'export-to-dashboard-icon',
    exportAsDashboardIconIconDisabled: 'export-to-dashboard-icon-disabled',
    snoozeAlertRules: 'alert-rules-snooze',
    snoozeAlertRulesIcon: 'alert-rules-snooze-icon',
    snoozeAlertRulesIconDisabled: 'alert-rules-snooze-icon-disabled',
    turnOffAlertRules: 'alert-rules-off',
    turnOffAlertRulesIcon: 'alert-rules-off-icon',
    turnOffAlertRulesIconDisabled: 'alert-rules-off-icon-disabled',
    turnOnAlertRules: 'alert-rules-on',
    turnOnAlertRulesIcon: 'alert-rules-on-icon',
    turnOnAlertRulesIconDisabled: 'alert-rules-on-icon-disabled',
  },
  'dropdown-actions'
);

export { dataTestIds as dataTestIdsDropdownMetricsActions };

export interface DropdownMetricsActions {
  metrics: Metric[];
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Dropdown with various actions related to multiple Metrics.
 */
export const DropdownMetricsActions: React.FC<DropdownMetricsActions> = ({ metrics, onSuccess }) => {
  const [coreState] = useCoreStore();
  const [dialog, setDialog] = React.useState<DialogType>(null);
  const snoozeAlertRules = useAlertRulesSnoozeFormGenConfig({ metrics });
  const snackbar = useGlobalSnackbar();
  const history = useHistory();
  const { createRedisJsonObject } = useRedisJsonObjectApi<BulkApplyWorkflow>();

  const isBulkApplyDisabled = React.useMemo(
    () => uniq(metrics.map(metric => metric.measurementType)).length !== 1 || metrics.length < 2,
    [metrics]
  );

  const isExportAsDashboardDisabled = React.useMemo(() => metrics.length < 2, [metrics]);

  const handleBulkApply = () => {
    const metricIds = metrics.map(metric => metric.id);

    createRedisJsonObject({
      value: { metricIds },
      onSuccess: redisJsonObject => {
        history.push(PATHS.bulkApplyPage(redisJsonObject.id));
      },
    });
  };

  const isAlertRulesDisabled = React.useMemo(
    () => metrics.every(metric => (metric.alertRules.length == 0 ? true : false)) || metrics.length < 2,
    [metrics]
  );

  const { makeRequest: updateAlertRules } = usePutRequest({ url: EVS_URLS.alertRules.bulkUpdateUrl() });

  function handleAlertRulesUpdate(isEnabled: boolean) {
    // Get all alertRules associated with selected metrics, use flatMap to handle multi-alertRules per metric
    const alertRules = metrics.flatMap(metric => metric.alertRules);
    // Prepare updated alert rules structure based on dialog to ON with isEnabled:true, OFF with isEnabled:false
    const updatedAlertRules = alertRules.map(alertRule => ({
      ...alertRule,
      isEnabled,
      snoozedUntil: null,
      updatedBy: coreState.currentUser.username,
    }));
    updateAlertRules({
      data: { requests: updatedAlertRules },
      onSuccess: () => {
        // Global onSuccess call refreshes ag-grid with update
        void onSuccess(updatedAlertRules);
        snackbar.successSnackbar('Updated Alert Rules with success');
        setDialog(null);
      },
      onError: error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ title: 'Error updating Alert Rules', message });
      },
    });
  }

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.EDIT} disableSnackbar>
      <Dropdown data-testid={dataTestIds.root}>
        <DropdownItem
          onClick={handleBulkApply}
          data-testid={dataTestIds.bulkApply}
          disabled={isBulkApplyDisabled}
          style={{ pointerEvents: 'unset' }}
        >
          <DropdownItemIcon>
            {isBulkApplyDisabled ? (
              <Tooltip arrow title="You need to select two or more Metrics with the same Measurement Type.">
                <InfoOutlined data-testid={dataTestIds.bulkApplyIconDisabled} />
              </Tooltip>
            ) : (
              <FileCopyOutlined data-testid={dataTestIds.bulkApplyIcon} />
            )}
          </DropdownItemIcon>
          <DropdownItemText>Bulk Apply</DropdownItemText>
        </DropdownItem>

        <DropdownItem
          onClick={() => setDialog(DialogType.exportAsDashoard)}
          data-testid={dataTestIds.exportAsDashboard}
          disabled={isExportAsDashboardDisabled}
          style={{ pointerEvents: 'unset' }}
        >
          <DropdownItemIcon>
            {isExportAsDashboardDisabled ? (
              <Tooltip arrow title="You need to select two or more Metrics.">
                <InfoOutlined data-testid={dataTestIds.exportAsDashboardIconIconDisabled} />
              </Tooltip>
            ) : (
              <FileCopyOutlined data-testid={dataTestIds.exportAsDashboardIcon} />
            )}
          </DropdownItemIcon>
          <DropdownItemText>Export As Dashboard</DropdownItemText>
        </DropdownItem>

        <DropdownItem
          onClick={() => setDialog(DialogType.turnOnAlertRules)}
          data-testid={dataTestIds.turnOnAlertRules}
          disabled={isAlertRulesDisabled}
          style={{ pointerEvents: 'unset' }}
        >
          <DropdownItemIcon>
            {isAlertRulesDisabled ? (
              <Tooltip arrow title="You need to select two or more Metrics with Alert Rules.">
                <InfoOutlined data-testid={dataTestIds.turnOnAlertRulesIconDisabled} />
              </Tooltip>
            ) : (
              <Notifications data-testid={dataTestIds.turnOnAlertRulesIcon} />
            )}
          </DropdownItemIcon>
          <DropdownItemText>Turn Alerts On</DropdownItemText>
        </DropdownItem>

        <DropdownItem
          onClick={() => setDialog(DialogType.turnOffAlertRules)}
          data-testid={dataTestIds.turnOffAlertRules}
          disabled={isAlertRulesDisabled}
          style={{ pointerEvents: 'unset' }}
        >
          <DropdownItemIcon>
            {isAlertRulesDisabled ? (
              <Tooltip arrow title="You need to select two or more Metrics with Alert Rules.">
                <InfoOutlined data-testid={dataTestIds.turnOffAlertRulesIconDisabled} />
              </Tooltip>
            ) : (
              <NotificationsOff data-testid={dataTestIds.turnOffAlertRulesIcon} />
            )}
          </DropdownItemIcon>
          <DropdownItemText>Turn Alerts Off</DropdownItemText>
        </DropdownItem>

        <DropdownItem
          onClick={() => setDialog(DialogType.snoozeAlertRules)}
          data-testid={dataTestIds.snoozeAlertRules}
          disabled={isAlertRulesDisabled}
          style={{ pointerEvents: 'unset' }}
        >
          <DropdownItemIcon>
            {isAlertRulesDisabled ? (
              <Tooltip arrow title="You need to select two or more Metrics with Alert Rules.">
                <InfoOutlined data-testid={dataTestIds.snoozeAlertRulesIconDisabled} />
              </Tooltip>
            ) : (
              <NotificationsPaused data-testid={dataTestIds.snoozeAlertRulesIcon} />
            )}
          </DropdownItemIcon>
          <DropdownItemText>Snooze Alerts</DropdownItemText>
        </DropdownItem>
      </Dropdown>

      <DialogConfirmation
        open={Boolean(dialog === DialogType.turnOnAlertRules)}
        title="Do you want to turn on Alert Rules for all selected metrics ?"
        onConfirm={() => handleAlertRulesUpdate(true)}
        onCancel={() => setDialog(null)}
        data-testid={dataTestIds.dialogAlertRulesOn.root}
      />
      <DialogConfirmation
        open={Boolean(dialog === DialogType.turnOffAlertRules)}
        title="Do you want to turn off Alert Rules for all selected metrics ?"
        onConfirm={() => handleAlertRulesUpdate(false)}
        onCancel={() => setDialog(null)}
        data-testid={dataTestIds.dialogAlertRulesOff.root}
      />
      <DialogBaseForm
        isUpdating={true}
        open={Boolean(dialog === DialogType.snoozeAlertRules)}
        onClose={() => setDialog(null)}
        onSuccess={response => {
          // Global onSuccess call refreshes ag-grid with update
          void onSuccess(response);
          snackbar.successSnackbar('Updated Alert Rules with success');
          setDialog(null);
        }}
        disableDefaultOnSuccessHandler
        formGenConfig={snoozeAlertRules}
        data-testid={dataTestIds.dialogAlertRulesSnooze}
      />
      <DialogExportAsDashboard
        open={dialog === DialogType.exportAsDashoard}
        onClose={() => setDialog(null)}
        onSuccess={() => setDialog(null)}
        metrics={metrics}
      />
    </Can>
  );
};
