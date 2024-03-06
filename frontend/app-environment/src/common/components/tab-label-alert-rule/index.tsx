import { Delete, Edit } from '@material-ui/icons';
import { dataTestIdsLegendColor, LegendColor } from '@plentyag/app-environment/src/common/components';
import { useAlertRuleFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import {
  EVS_URLS,
  getAlertRuleTypeLabel,
  getBackgroundColorsForAlertRuleType,
  getLinearGradientRotate,
} from '@plentyag/app-environment/src/common/utils';
import {
  DialogBaseForm,
  DialogConfirmation,
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemText,
  Show,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useDeletedByHeader } from '@plentyag/core/src/hooks';
import { AlertRule, AlertRuleType, Metric } from '@plentyag/core/src/types/environment';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

enum DialogType {
  edit = 'EDIT',
  delete = 'DELETE',
}

const dataTestIds = {
  root: 'tab-label-alert-rule',
  legend: dataTestIdsLegendColor.root,
  dropdown: 'tab-label-alert-rule-dropdown',
  edit: 'tab-label-alert-rule-dropdown-item-edit',
  delete: 'tab-label-alert-rule-dropdown-item-delete',
  dialogEdit: 'tab-label-alert-rule-dialog-edit',
  dialogDelete: 'tab-label-alert-rule-dialog-delete',
};

export { dataTestIds as dataTestIdsTabLabelAlertRule };

export interface TabLabelAlertRule {
  metric: Metric;
  alertRule: AlertRule;
  readOnly?: boolean;
  onAlertRuleChange?: () => void;
}

/**
 * Label for a Tab with content related to an AlertRule.
 */
export const TabLabelAlertRule: React.FC<TabLabelAlertRule> = ({
  metric,
  alertRule,
  readOnly = false,
  onAlertRuleChange = () => {},
}) => {
  const [dialog, setDialog] = React.useState<DialogType>();
  const snackbar = useGlobalSnackbar();
  const deletedByHeader = useDeletedByHeader();
  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser?.username;
  const formGenConfig = useAlertRuleFormGenConfig({ metric, username, alertRule });

  function deleteAlertRule(alertRule: AlertRule) {
    axiosRequest({
      method: 'DELETE',
      headers: deletedByHeader,
      url: EVS_URLS.alertRules.deleteUrl(alertRule),
    })
      .then(() => snackbar.successSnackbar('Alert Rule successfully deleted.'))
      .then(() => {
        setDialog(null);
        onAlertRuleChange();
      })
      .catch(() => {
        snackbar.errorSnackbar();
        setDialog(null);
      });
  }

  const label = getAlertRuleTypeLabel(alertRule.alertRuleType);

  return (
    <Box display="flex" data-testid={dataTestIds.root} alignItems="center">
      {label}

      {alertRule.alertRuleType !== AlertRuleType.nonNumerical && (
        <>
          <Box padding={1} />
          <LegendColor
            borderColor={getBackgroundColorsForAlertRuleType(alertRule.alertRuleType)[0]}
            backgroundColorLinearGradient={getBackgroundColorsForAlertRuleType(alertRule.alertRuleType)}
            linearGradientRotate={getLinearGradientRotate(alertRule.alertRuleType)}
          />
        </>
      )}

      <Show when={!readOnly}>
        <Dropdown stopPropagation data-testid={dataTestIds.dropdown}>
          <DropdownItem onClick={() => setDialog(DialogType.edit)} data-testid={dataTestIds.edit}>
            <DropdownItemIcon>
              <Edit />
            </DropdownItemIcon>
            <DropdownItemText>Edit</DropdownItemText>
          </DropdownItem>
          <DropdownItem onClick={() => setDialog(DialogType.delete)} data-testid={dataTestIds.delete}>
            <DropdownItemIcon>
              <Delete />
            </DropdownItemIcon>
            <DropdownItemText>Delete</DropdownItemText>
          </DropdownItem>
        </Dropdown>
        <DialogBaseForm
          open={dialog === DialogType.edit}
          onSuccess={() => {
            setDialog(null);
            onAlertRuleChange();
          }}
          onClose={() => setDialog(null)}
          formGenConfig={formGenConfig}
          initialValues={alertRule}
          data-testid={dataTestIds.dialogEdit}
          isUpdating
          disableGoToPath
        />
        <DialogConfirmation
          title={`Are you sure you would like to delete the ${label}?`}
          open={dialog === DialogType.delete}
          onConfirm={() => deleteAlertRule(alertRule)}
          onCancel={() => setDialog(null)}
          data-testid={dataTestIds.dialogDelete}
        />
      </Show>
    </Box>
  );
};
