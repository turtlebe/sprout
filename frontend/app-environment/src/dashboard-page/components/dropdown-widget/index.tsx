import { Delete, Edit } from '@material-ui/icons';
import { useWidgetFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
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
import { useDeletedByHeader, useDeleteRequest } from '@plentyag/core/src/hooks';
import { Widget } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useDashboardGridContext } from '../../hooks';

enum DialogType {
  deleteWidet = 'DELETE_WIDGET',
  editWidgetName = 'EDIT_WIDGET_NAME',
}

const dataTestIds = getScopedDataTestIds(
  {
    dropdown: 'dropdown',
    deleteWidget: 'delete-widget',
    editWidget: 'edit-widget',
    editWidgetName: 'edit-widget-name',
    deleteWidgetDialogConfirmation: getDialogConfirmationDataTestIds('dropdown-widget-dialog-confirmation'),
    dialogEditWidgetName: 'dialog-edit-widget-name',
  },
  'dropdownWidget'
);

export { dataTestIds as dataTestIdsDropdownWidget };

export interface DropdownWidget {
  widget: Widget;
  onWidgetDeleted: () => void;
  onEditWidget: () => void;
}

export const DropdownWidget: React.FC<DropdownWidget> = ({ widget, onWidgetDeleted, onEditWidget, children }) => {
  const { canDrag } = useDashboardGridContext();
  const [dialog, setDialog] = React.useState<DialogType>();
  const deletedByHeader = useDeletedByHeader();
  const { makeRequest, isLoading } = useDeleteRequest({
    url: EVS_URLS.widgets.deleteUrl(widget),
    headers: deletedByHeader,
  });
  const snackbar = useGlobalSnackbar();
  const widgetFormGenConfig = useWidgetFormGenConfig({ widget });

  const handleDeleteWidget = () => {
    setDialog(null);
    makeRequest({
      onSuccess: onWidgetDeleted,
      onError: snackbar.errorSnackbar,
    });
  };

  return (
    <>
      <Dropdown data-testid={dataTestIds.dropdown} disabled={canDrag}>
        <DropdownItem
          onClick={() => setDialog(DialogType.deleteWidet)}
          disabled={isLoading}
          data-testid={dataTestIds.deleteWidget}
        >
          <DropdownItemIcon>
            <Delete />
          </DropdownItemIcon>
          <DropdownItemText>Delete Widget</DropdownItemText>
        </DropdownItem>
        <DropdownItem onClick={onEditWidget} disabled={isLoading} data-testid={dataTestIds.editWidget}>
          <DropdownItemIcon>
            <Edit />
          </DropdownItemIcon>
          <DropdownItemText>Edit Widget's Content</DropdownItemText>
        </DropdownItem>
        <DropdownItem
          onClick={() => setDialog(DialogType.editWidgetName)}
          disabled={isLoading}
          data-testid={dataTestIds.editWidgetName}
        >
          <DropdownItemIcon>
            <Edit />
          </DropdownItemIcon>
          <DropdownItemText>Edit Widget's Name</DropdownItemText>
        </DropdownItem>
        {children}
      </Dropdown>
      <DialogConfirmation
        data-testid={dataTestIds.deleteWidgetDialogConfirmation.root}
        title="Are you sure you would like to delete this Widget?"
        confirmLabel="Yes"
        open={dialog === DialogType.deleteWidet}
        onConfirm={handleDeleteWidget}
        onCancel={() => setDialog(null)}
      />
      <DialogBaseForm
        open={dialog === DialogType.editWidgetName}
        onSuccess={() => {
          setDialog(null);
          onWidgetDeleted();
        }}
        onClose={() => setDialog(null)}
        formGenConfig={widgetFormGenConfig}
        initialValues={widget}
        isUpdating={true}
        data-testid={dataTestIds.dialogEditWidgetName}
      />
    </>
  );
};
