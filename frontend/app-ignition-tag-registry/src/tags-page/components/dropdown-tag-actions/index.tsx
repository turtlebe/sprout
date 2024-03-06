import { Cancel, CheckCircle, Delete } from '@material-ui/icons';
import { Tag } from '@plentyag/app-ignition-tag-registry/src/common/types';
import {
  dataTestIdsDialogConfirmation,
  DialogConfirmation,
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemText,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Can } from '@plentyag/core/src/components/can';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { useDeletedByHeader } from '@plentyag/core/src/hooks';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

const dataTestIds = {
  dropdowntagActions: 'actions',
  approveDropdownItem: 'dropdown-item-approve-tag',
  deactivateDropdownItem: 'dropdown-item-deactivate-tag',
  deleteDropdownItem: 'dropdown-item-delete-tag',
  dialog: dataTestIdsDialogConfirmation,
};

export { dataTestIds as dataTestIdsDropdownTagActions };

export interface DropdownTagActions {
  tags: Tag[];
  onSuccess: () => void;
}

export const DropdownTagActions: React.FC<DropdownTagActions> = ({ tags = [], onSuccess }) => {
  const snackbar = useGlobalSnackbar();
  const [openApproveDialog, setOpenApproveDialog] = React.useState<boolean>(false);
  const [openDeactivateDialog, setOpenDeactivateDialog] = React.useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);

  const deletedByHeader = useDeletedByHeader();

  const handleApproveConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      tags.map(async tag =>
        axiosRequest({
          method: 'PUT',
          url: `/api/swagger/farm-def-service/tags-api/update-tag/${tag.uid}`,
          data: { ...tag, tagStatus: 'ACTIVE' },
        })
      )
    )
      .then(() => snackbar.successSnackbar('Tag(s) successfully approved.'))
      .then(onSuccess)
      .catch(() => snackbar.errorSnackbar({ message: 'Something went wrong when approving the selected Tags.' }))
      .finally(() => setOpenApproveDialog(false));
  };

  const handleDeactivateConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      tags.map(async tag =>
        axiosRequest({
          method: 'PUT',
          url: `/api/swagger/farm-def-service/tags-api/update-tag/${tag.uid}`,
          data: { ...tag, tagStatus: 'INACTIVE' },
        })
      )
    )
      .then(() => snackbar.successSnackbar('Tag(s) successfully deactivated.'))
      .then(onSuccess)
      .catch(() => snackbar.errorSnackbar({ message: 'Something went wrong when dectivating the selected Tags.' }))
      .finally(() => setOpenDeactivateDialog(false));
  };

  const handleDeleteConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      tags.map(async tag =>
        axiosRequest({
          method: 'DELETE',
          headers: deletedByHeader,
          url: `/api/swagger/farm-def-service/tags-api/delete-tag/${tag.uid}`,
        })
      )
    )
      .then(() => snackbar.successSnackbar('Tag(s) successfully deleted.'))
      .then(onSuccess)
      .catch(() => snackbar.errorSnackbar({ message: 'Something went wrong when deleting the selected Tags.' }))
      .finally(() => setOpenDeleteDialog(false));
  };

  return (
    <Can resource={Resources.HYP_IGNITION_TAG_REGISTRY} level={PermissionLevels.FULL} disableSnackbar>
      <Dropdown data-testid={dataTestIds.dropdowntagActions} variant="contained" color="default" label="Actions">
        <DropdownItem
          disabled={tags.length === 0}
          onClick={() => setOpenApproveDialog(true)}
          data-testid={dataTestIds.approveDropdownItem}
        >
          <DropdownItemIcon>
            <CheckCircle />
          </DropdownItemIcon>
          <DropdownItemText>Approve Tag ({tags.length})</DropdownItemText>
        </DropdownItem>
        <DropdownItem
          disabled={tags.length === 0}
          onClick={() => setOpenDeactivateDialog(true)}
          data-testid={dataTestIds.deactivateDropdownItem}
        >
          <DropdownItemIcon>
            <Cancel />
          </DropdownItemIcon>
          <DropdownItemText>Deactivate Tag ({tags.length})</DropdownItemText>
        </DropdownItem>
        <DropdownItem
          disabled={tags.length === 0}
          onClick={() => setOpenDeleteDialog(true)}
          data-testid={dataTestIds.deleteDropdownItem}
        >
          <DropdownItemIcon>
            <Delete />
          </DropdownItemIcon>
          <DropdownItemText>Delete Tag ({tags.length})</DropdownItemText>
        </DropdownItem>
      </Dropdown>
      <DialogConfirmation
        title="Are you sure you would like to approve the selected Tags? Make sure to commit to ignition ingest to start reporting data from these to farmos."
        open={openApproveDialog}
        onConfirm={handleApproveConfirm}
        onCancel={() => setOpenApproveDialog(false)}
      />
      <DialogConfirmation
        title="Are you sure you would like to deactivate the selected Tags? These tags will no longer report ignition tag data to farmos."
        open={openDeactivateDialog}
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setOpenDeactivateDialog(false)}
      />
      <DialogConfirmation
        title="Are you sure you would like to delete the selected Tags?"
        open={openDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setOpenDeleteDialog(false)}
      />
    </Can>
  );
};
