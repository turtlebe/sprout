import { List, NotificationsNone, Settings, Timeline } from '@material-ui/icons';
import { useMetricErrorHandler, useMetricFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import { isNumericalMetric } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import {
  DialogBaseForm,
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemText,
} from '@plentyag/brand-ui/src/components';
import { Divider } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Metric, TabType } from '@plentyag/core/src/types/environment';
import React from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

const dataTestIds = {
  root: 'dropdown-metric-actions',
  dialogEditMetric: 'dropdown-metric-actions-dialog-edit-metric',
  editRules: 'dropdown-metric-actions-edit-alert-rules',
  editMetric: 'dropdown-metric-actions-edit-metric',
  viewSubscriptions: 'dropdown-metric-actions-view-subscriptions',
  viewSources: 'dropdown-metric-actions-view-sources',
};

export { dataTestIds as dataTestIdsDropdownMetricActions };

export interface DropdownMetricActions {
  metric: Metric;
  tabType: TabType;
  tabId: string;
  onEditAlertRule: () => void;
  onMetricUpdated: () => void;
}

/**
 * Dropdown to perform various actions related to a Metric:
 * - Edit the Metric
 * - Edit the currently displayed AlertRule's rules
 * - View Sources
 * - View Subscriptions
 */
export const DropdownMetricActions: React.FC<DropdownMetricActions> = ({
  metric,
  tabType,
  tabId,
  onEditAlertRule,
  onMetricUpdated,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const history = useHistory();

  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser?.username;
  const editMetricFormGenConfig = useMetricFormGenConfig({ metric, username });

  const { handleError } = useMetricErrorHandler();

  function handleViewSubscriptions() {
    if (tabType === TabType.schedule && metric.alertRules.length > 0) {
      history.push(PATHS.subscriptionsPageTab(metric.id, TabType.alertRule, metric.alertRules[0].id));
    } else {
      history.push(PATHS.subscriptionsPageTab(metric.id, tabType, tabId));
    }
  }

  if (!metric) {
    return null;
  }

  const hasNoAlertRules = metric.alertRules.length === 0;

  const hasNoSubscriptions = hasNoAlertRules || tabType === TabType.data;

  return (
    <>
      <Dropdown data-testid={dataTestIds.root}>
        <DropdownItem onClick={onEditAlertRule} disabled={hasNoAlertRules} data-testid={dataTestIds.editRules}>
          <DropdownItemIcon>
            <Timeline />
          </DropdownItemIcon>
          <DropdownItemText>Edit Rules (Chart)</DropdownItemText>
        </DropdownItem>
        <DropdownItem onClick={() => setOpen(true)} data-testid={dataTestIds.editMetric}>
          <DropdownItemIcon>
            <Settings />
          </DropdownItemIcon>
          <DropdownItemText>Edit Metric</DropdownItemText>
        </DropdownItem>
        <Divider />
        <DropdownItem
          onClick={handleViewSubscriptions}
          disabled={hasNoSubscriptions}
          data-testid={dataTestIds.viewSubscriptions}
        >
          <DropdownItemIcon>
            <NotificationsNone />
          </DropdownItemIcon>
          <DropdownItemText>View Subscriptions</DropdownItemText>
        </DropdownItem>
        {isNumericalMetric(metric) && (
          <DropdownItem
            data-testid={dataTestIds.viewSources}
            component={NavLink}
            to={PATHS.metricSourcesPage(metric.id)}
          >
            <DropdownItemIcon>
              <List />
            </DropdownItemIcon>
            <DropdownItemText>View Sources</DropdownItemText>
          </DropdownItem>
        )}
      </Dropdown>
      <DialogBaseForm
        open={open}
        onSuccess={() => {
          setOpen(false);
          onMetricUpdated();
        }}
        onClose={() => setOpen(false)}
        onError={handleError}
        disableDefaultOnErrorHandler
        formGenConfig={editMetricFormGenConfig}
        isUpdating={true}
        initialValues={metric}
        data-testid={dataTestIds.dialogEditMetric}
        maxWidth="lg"
      />
    </>
  );
};
