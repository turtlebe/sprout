import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface DeleteDialog {
  statusTitle?: string;
  status?: React.ReactNode;
  open: boolean;
  onCancel?: () => void;
  onAction?: () => void;
  actionTitle?: string;
  actionEndIcon?: React.ReactNode;
  buttonsDisabled?: boolean;
}

export const DeleteDialog: React.FC<DeleteDialog> = props => {
  return (
    <Dialog fullWidth={true} maxWidth="sm" open={props.open} onClose={props.onCancel}>
      <DialogTitle>{props.statusTitle || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.status}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={props.buttonsDisabled} onClick={props.onAction} color="primary" endIcon={props.actionEndIcon}>
          {props.actionTitle || ''}
        </Button>
        <Button disabled={props.buttonsDisabled} onClick={props.onCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
