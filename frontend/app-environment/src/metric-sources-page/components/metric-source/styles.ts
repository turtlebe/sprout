import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    '&:last-child': { marginBottom: theme.spacing(0) },
  },
}));
