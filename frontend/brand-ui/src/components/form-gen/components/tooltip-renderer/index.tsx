import { Help } from '@material-ui/icons';
import { isConcreteField } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { Box, IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

export const dataTestIds = {
  root: 'tooltip-renderer-root',
  icon: 'tooltip-renderer-icon',
};

export const TooltipRenderer: React.FC<FormGen.FieldProps<FormGen.FieldAny>> = props => {
  const classes = useStyles({});
  const { formGenField } = props;
  const [open, setOpen] = React.useState<boolean>(false);

  // handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!isConcreteField(formGenField) || !formGenField.tooltip) {
    return <span></span>;
  }

  const TooltipComponent = formGenField.tooltip;

  return (
    <Box className={classes.tooltipIcon} data-testid={dataTestIds.root}>
      <IconButton size="small" icon={Help} onClick={handleOpen} data-testid={dataTestIds.icon} />
      <TooltipComponent {...props} onClose={handleClose} open={open} />
    </Box>
  );
};
