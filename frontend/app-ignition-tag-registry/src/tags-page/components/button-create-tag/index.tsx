import { Add } from '@material-ui/icons';
import { useTagFormGenConfig } from '@plentyag/app-ignition-tag-registry/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

const dataTestIds = {
  button: 'button-create-tag',
  dialog: 'button-create-tag-dialog',
};

export { dataTestIds as dataTestIdsButtonCreateTag };

export interface ButtonCreateTag {
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Button gated by permissions to open a dialog and create a new Tag.
 */
export const ButtonCreateTag: React.FC<ButtonCreateTag> = ({ onSuccess }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useTagFormGenConfig({ username: coreStore.currentUser?.username });

  const handleSuccess = response => {
    setOpen(false);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_IGNITION_TAG_REGISTRY} level={PermissionLevels.EDIT} disableSnackbar>
      <Button data-testid={dataTestIds.button} variant="contained" onClick={() => setOpen(true)} startIcon={<Add />}>
        Create Tag
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
        maxWidth="md"
      />
    </Can>
  );
};
