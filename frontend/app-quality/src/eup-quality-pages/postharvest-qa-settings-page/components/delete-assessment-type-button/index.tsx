import DeleteIcon from '@material-ui/icons/Delete';
import { DELETE_ASSESSMENT_TYPE_URL } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { AssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { DialogConfirmation, Show } from '@plentyag/brand-ui/src/components';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { useDeleteRequest } from '@plentyag/core/src/hooks';
import React, { useState } from 'react';

import { useStyles } from './styles';

export interface DeleteAssessmentTypeButton {
  onDelete: () => void;
  assessmentType: AssessmentTypes;
}

const dataTestIds = {
  root: 'delete-assessment-type-button-root',
};

export { dataTestIds as dataTestIdsDeleteAssessmentTypeButton };

export const SUCCESS_MESSAGE = label => `Assessment type "${label}" deleted!`;
export const ERROR_MESSAGE = label => `Assessment type "${label}" could not be deleted`;

export const DeleteAssessmentTypeButton: React.FC<DeleteAssessmentTypeButton> = ({
  onDelete = () => {},
  assessmentType,
}) => {
  const snackbar = useGlobalSnackbar();
  const classes = useStyles({});
  const [open, setOpen] = useState<boolean>(false);
  const [{ currentUser }] = useCoreStore();

  const { username } = currentUser;
  const { label, valueType } = assessmentType;

  const { makeRequest: makeDeleteRequest, isLoading: isDeleteLoading } = useDeleteRequest({
    url: `${DELETE_ASSESSMENT_TYPE_URL}/${assessmentType.id}`,
    headers: { 'X-Deleted-By': username },
  });

  const hasPermission = currentUser.hasPermission(Resources.HYP_QUALITY, PermissionLevels.EDIT);

  const handleDelete = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function handleConfirm() {
    if (isDeleteLoading) {
      return;
    }
    setOpen(false);
    makeDeleteRequest({
      onSuccess: () => {
        snackbar.successSnackbar(SUCCESS_MESSAGE(label));
        onDelete();
      },
      onError: () => snackbar.errorSnackbar({ message: ERROR_MESSAGE(label) }),
    });
    onDelete();
  }

  return (
    <Show when={hasPermission}>
      <IconButton
        className={classes.button}
        aria-label="Delete assessment type"
        data-testid={dataTestIds.root}
        icon={DeleteIcon}
        onClick={handleDelete}
      />
      <DialogConfirmation
        title="Are you sure you would like to delete this assessment type?"
        open={open}
        cancelLabel="No, go back"
        confirmLabel="Yes, delete this assessment type"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        {label} -- {valueType}
      </DialogConfirmation>
    </Show>
  );
};
