import { DialogDashboardAlertRules } from '@plentyag/app-environment/src/common/components';
import { useDashboardFormGenConfig, useWidgetFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm, Dropdown, DropdownItem, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Dashboard, Widget } from '@plentyag/core/src/types/environment';
import React from 'react';

enum DialogType {
  editDashboard = 'EDIT_DASHBOARD',
  editDashboardAlertRules = 'EDIT_DASHBOARD_ALERT_RULES',
  addWidget = 'ADD_WIDGET',
}

const dataTestIds = {
  root: 'dropdown-dashboard-actions',
  editDashboard: 'dropdown-dashboard-actions-edit',
  editDashboardAlertRules: 'dropdown-dashboard-actions-edit-dashboard-alert-rules',
  addWidget: 'dropdown-dashboard-add-widget',
  moveResizeWidgets: 'dropdown-dashboard-move-resize-widgets',
  dialogEditDashboard: 'dropdown-dashboard-actions-dialog-edit-dashboard',
  dialogEditDashboardAlertRules: 'dropdown-dashboard-actions-dialog-edit-dashboard-alert-rules',
  dialogAddWidget: 'dropdown-dashboard-add-widget',
};

export { dataTestIds as dataTestIdsDropdownDashboardActions };

export interface DropdownDashboardActions {
  onDashboardUpdated: () => void;
  onClickMoveResizeWidgets?: () => void;
  dashboard: Dashboard;
  widgets?: Widget[];
}

/**
 * Dropdown to perform various actions related to a Dashboard:
 * - Edit the Dashboard
 * - Edit the Metrics and Schedules associated to the Dashboard.
 */
export const DropdownDashboardActions: React.FC<DropdownDashboardActions> = ({
  dashboard,
  widgets,
  onDashboardUpdated,
  onClickMoveResizeWidgets,
}) => {
  const [dialog, setDialog] = React.useState<DialogType>(null);
  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser?.username;
  const dashboardFormGenConfig = useDashboardFormGenConfig({ dashboard, username });
  const widgetFormGenConfig = useWidgetFormGenConfig({ dashboardId: dashboard?.id, widgets });

  return (
    <>
      <Dropdown data-testid={dataTestIds.root}>
        <DropdownItem onClick={() => setDialog(DialogType.editDashboard)} data-testid={dataTestIds.editDashboard}>
          <DropdownItemText>Edit Dashboard's Name</DropdownItemText>
        </DropdownItem>
        <DropdownItem
          onClick={() => setDialog(DialogType.editDashboardAlertRules)}
          data-testid={dataTestIds.editDashboardAlertRules}
        >
          <DropdownItemText>Edit Alert Rules (On/Off/Snooze)</DropdownItemText>
        </DropdownItem>
        <DropdownItem onClick={() => setDialog(DialogType.addWidget)} data-testid={dataTestIds.dialogAddWidget}>
          <DropdownItemText>Add Widget</DropdownItemText>
        </DropdownItem>
        {onClickMoveResizeWidgets && (
          <DropdownItem onClick={onClickMoveResizeWidgets} data-testid={dataTestIds.moveResizeWidgets}>
            <DropdownItemText>Move/Resize Widgets</DropdownItemText>
          </DropdownItem>
        )}
      </Dropdown>

      <DialogBaseForm
        open={dialog === DialogType.editDashboard}
        onSuccess={() => {
          setDialog(null);
          onDashboardUpdated();
        }}
        onClose={() => setDialog(null)}
        formGenConfig={dashboardFormGenConfig}
        isUpdating={true}
        initialValues={dashboard}
        data-testid={dataTestIds.dialogEditDashboard}
      />
      <DialogDashboardAlertRules
        open={dialog === DialogType.editDashboardAlertRules}
        widgets={widgets}
        onClose={() => setDialog(null)}
        onDashboardUpdated={() => {
          setDialog(null);
          onDashboardUpdated();
        }}
        data-testid={dataTestIds.dialogEditDashboardAlertRules}
      />
      <DialogBaseForm
        open={dialog === DialogType.addWidget}
        onSuccess={() => {
          setDialog(null);
          onDashboardUpdated();
        }}
        onClose={() => setDialog(null)}
        formGenConfig={widgetFormGenConfig}
        data-testid={dataTestIds.dialogAddWidget}
      />
    </>
  );
};
