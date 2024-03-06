import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  groupRowError: {
    border: `1px solid ${theme.palette.error.main} !important`,
  },
  groupRowSuccess: {
    color: theme.palette.success.main,
    border: `1px solid ${theme.palette.success.main} !important`,
  },
}));
