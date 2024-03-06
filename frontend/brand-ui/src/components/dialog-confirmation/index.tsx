import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { Show } from '../show';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    content: 'content',
    actions: 'actions',
    confirm: 'confirm',
    cancel: 'cancel',
    confirmProgress: 'confirm-progress',
  },
  'dialogConfirmation'
);

export { dataTestIds as dataTestIdsDialogConfirmation };

/** Allows the caller to use custom dataTestIds with a prefix and re-use those in tests. */
export const getDialogConfirmationDataTestIds = (prefix = '') => getScopedDataTestIds(dataTestIds, prefix);

export interface DialogConfirmation {
  open: boolean;
  title: string;
  confirmLabel?: React.ReactNode;
  isConfirmInProgress?: boolean;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dialogWidth?: DialogProps['maxWidth'];
  'data-testid'?: string;
}

export const DialogConfirmation: React.FC<DialogConfirmation> = ({
  dialogWidth = 'sm',
  open,
  title,
  children,
  onCancel,
  onConfirm,
  confirmLabel = 'I understand',
  isConfirmInProgress,
  cancelLabel = 'Cancel',
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getDialogConfirmationDataTestIds(dataTestId);

  return (
    <Dialog fullWidth={true} maxWidth={dialogWidth} open={open} data-testid={dataTestIdsWithPrefix.root}>
      <DialogTitle data-testid={dataTestIdsWithPrefix.title}>{title}</DialogTitle>

      {children && (
        <DialogContent data-testid={dataTestIdsWithPrefix.content}>
          <DialogContentText>{children}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions data-testid={dataTestIdsWithPrefix.actions}>
        {onCancel && (
          <Button onClick={onCancel} data-testid={dataTestIdsWithPrefix.cancel}>
            {cancelLabel}
          </Button>
        )}
        <Button
          disabled={isConfirmInProgress}
          startIcon={
            <Show when={isConfirmInProgress}>
              <CircularProgress data-testid={dataTestIdsWithPrefix.confirmProgress} size="1rem" />
            </Show>
          }
          onClick={onConfirm}
          variant="contained"
          color="primary"
          data-testid={dataTestIdsWithPrefix.confirm}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
