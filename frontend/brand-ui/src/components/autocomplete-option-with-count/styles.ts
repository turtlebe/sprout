import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  info: {
    color: theme.palette.grey[700],
    fontSize: '12px',
  },
}));
