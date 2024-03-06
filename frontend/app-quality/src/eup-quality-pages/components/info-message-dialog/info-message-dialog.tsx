import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface InfoDialog {
  statusTitle?: string;
  content?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
}

export const dataTestIdsInfoDialog = {
  root: 'dialogInfo-root',
  title: 'dialogInfo-title',
  content: 'dialogInfo-content',
  button: 'dialogInfo-close',
};

export const InfoDialog: React.FC<InfoDialog> = props => {
  return (
    <Dialog fullWidth={true} maxWidth="sm" open={props.open} data-testid={dataTestIdsInfoDialog.root}>
      <DialogTitle data-testid={dataTestIdsInfoDialog.title}>{props.statusTitle || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText data-testid={dataTestIdsInfoDialog.content}>{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={false} onClick={props.onClose} color="primary" data-testid={dataTestIdsInfoDialog.button}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
