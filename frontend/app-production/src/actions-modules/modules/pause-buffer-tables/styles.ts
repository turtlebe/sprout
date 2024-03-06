import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  category: {
    background: 'white',
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.text.primary,
    borderRadius: 8,
    boxShadow: theme.shadows[1],
  },
}));
