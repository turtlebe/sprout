import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  errorIcon: {
    color: theme.palette.common.white,
  },
}));
