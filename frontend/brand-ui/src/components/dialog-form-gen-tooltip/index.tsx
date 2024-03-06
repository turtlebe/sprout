import { Close } from '@material-ui/icons';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'custom-dialog',
  title: 'custom-dialog-title',
  close: 'custom-dialog-close',
  content: 'custom-dialog-content',
};
export { dataTestIds as dataTestIdsDialogFormGenTooltip };

export interface DialogFormGenTooltip extends FormGen.TooltipProps {
  title: string;
}

export const DialogFormGenTooltip: React.FC<DialogFormGenTooltip> = ({ open, onClose, title, children, style }) => {
  const classes = useStyles({});

  return (
    <Dialog open={open} maxWidth={false} onClose={onClose} data-testid={dataTestIds.root}>
      <DialogTitle disableTypography classes={{ root: classes.dialogRoot }}>
        <Typography variant="h6" data-testid={dataTestIds.title}>
          {title}
        </Typography>
        <IconButton
          color="default"
          onClick={onClose}
          icon={Close}
          className={classes.closeButton}
          data-testid={dataTestIds.close}
        />
      </DialogTitle>
      <DialogContent style={style} data-testid={dataTestIds.content}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
