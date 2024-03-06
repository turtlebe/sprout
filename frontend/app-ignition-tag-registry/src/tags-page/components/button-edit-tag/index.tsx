import { Edit } from '@material-ui/icons';
import { useTagFormGenConfig } from '@plentyag/app-ignition-tag-registry/src/common/hooks';
import { Tag } from '@plentyag/app-ignition-tag-registry/src/common/types';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

const dataTestIds = {
  button: 'button-edit-tag',
  dialog: 'button-edit-tag-dialog',
};

export { dataTestIds as dataTestIdsButtonEditTag };

export interface ButtonEditTag {
  tag: Tag;
  onSuccess: DialogBaseForm['onSuccess'];
  disabled: boolean;
}

/**
 * Button gated by permissions to open a dialog and edit an existing Tag.
 */
export const ButtonEditTag: React.FC<ButtonEditTag> = ({ tag, onSuccess, disabled }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useTagFormGenConfig({ tag, username: coreStore.currentUser?.username });

  const handleSuccess = response => {
    setOpen(false);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_IGNITION_TAG_REGISTRY} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        data-testid={dataTestIds.button}
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<Edit />}
        disabled={disabled}
        color="default"
      >
        Edit Tag
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
        isUpdating={true}
        initialValues={tag}
        maxWidth="md"
      />
    </Can>
  );
};
