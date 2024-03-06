import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  passStatus: {
    color: theme.palette.success.main,
  },
  failStatus: {
    color: theme.palette.error.main,
  },
  current: {
    marginLeft: theme.spacing(0.5),
  },
}));
