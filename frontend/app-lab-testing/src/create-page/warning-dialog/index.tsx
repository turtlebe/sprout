import { Warning } from '@material-ui/icons';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const dataTestIds = {
  dialog: 'dialog-container',
};

export type ActionResult = 'ignore-warning' | 'fix-warning';

export interface WarningDialog {
  open: boolean;
  action?: (result: ActionResult) => void;
}

export const useWarningDialog = () => {
  const [warningDialogStatus, setWarningDialogStatus] = React.useState<WarningDialog>({ open: false });

  async function check(hasWarning): Promise<ActionResult> {
    if (hasWarning) {
      return new Promise<ActionResult>(resolve => {
        setWarningDialogStatus({ open: true, action: resolve });
      }).finally(() => setWarningDialogStatus({ open: false }));
    }

    // no warning - so can ignore
    return 'ignore-warning';
  }

  const checkWarning = React.useCallback(async (hasWarning: boolean): Promise<ActionResult> => check(hasWarning), []);

  return { warningDialogStatus, checkWarning };
};

export const WarningDialog: React.FC<WarningDialog> = props => {
  function onIgnore() {
    props.action && props.action('ignore-warning');
  }
  function onFix() {
    props.action && props.action('fix-warning');
  }
  return (
    <Dialog data-testid={dataTestIds.dialog} fullWidth={true} maxWidth="sm" open={props.open} onClose={onFix}>
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Warning style={{ marginRight: '5px' }} />
          Some fields have warnings
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Please check warnings before submitting lab samples.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onIgnore} color="primary">
          Submit
        </Button>
        <Button onClick={onFix} color="primary">
          Check Warning
        </Button>
      </DialogActions>
    </Dialog>
  );
};
