import { ArrowDownward } from '@material-ui/icons';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DownloadItemButton } from './download-item-button';

export const dataTestIds = {
  dialog: 'dialog',
};

export interface StatusModal {
  containerRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  testResults: LT.DownloadMetadata[];
  onClose?: () => void;
}

const useStyles = makeStyles(() => ({
  button: {
    margin: '0.25rem',
  },
}));

/**
 * Displays a dialog with a list of buttons for downloading
 * items based on their date.
 */
export const DownloadItemsDialog: React.FC<StatusModal> = props => {
  const classes = useStyles({});

  const buttons = props.testResults.map(result => {
    return (
      <DownloadItemButton
        key={result.uuid}
        containerRef={props.containerRef}
        downloadUuid={result.uuid}
        startIcon={<ArrowDownward style={{ fontSize: '1rem' }} />}
        text={result.date.toLocaleTimeString('en-us', { year: 'numeric', month: 'numeric', day: 'numeric' })}
        className={classes.button}
      />
    );
  });
  return (
    <Dialog data-testid={dataTestIds.dialog} fullWidth={true} maxWidth="sm" open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Multiple downloads are available. Click below for results.</DialogTitle>
      <DialogContent>{buttons}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
