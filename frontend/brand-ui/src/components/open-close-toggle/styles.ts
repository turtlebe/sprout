import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  openCloseToggle: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    zIndex: theme.zIndex.drawer,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
}));
