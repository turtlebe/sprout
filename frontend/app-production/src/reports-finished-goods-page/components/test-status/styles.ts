import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  noneStatus: {
    color: theme.palette.grey[400],
  },
  holdStatus: {
    color: theme.palette.secondary.main,
  },
  passStatus: {
    color: theme.palette.success.main,
  },
  failStatus: {
    color: theme.palette.error.main,
  },
  current: {
    marginLeft: theme.spacing(0.5),
  },
  overridden: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.grey[400],
  },
}));
