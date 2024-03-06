import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface SaveLabelSetsDialog {
  status?: React.ReactNode;
  open: boolean;
  handleCloseSaveLabelSets: () => void;
}

export const SaveLabelSetsDialog: React.FC<SaveLabelSetsDialog> = ({ status, open, handleCloseSaveLabelSets }) => {
  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleCloseSaveLabelSets}>
      <DialogTitle>Saved Label Sets</DialogTitle>
      <DialogContent>{status || null}</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSaveLabelSets} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
