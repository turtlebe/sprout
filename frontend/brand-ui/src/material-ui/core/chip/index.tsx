import { ChipProps, makeStyles, Chip as MuiChip } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

export const useStyles = makeStyles(() => ({}));

export interface Chip extends Omit<ChipProps, 'classes'> {}
export const Chip = React.memo((props: Chip) => {
  const classes = useStyles({});
  return <MuiChip deleteIcon={<Close />} classes={classes} {...props} />;
});
