import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  settingsOverlay: {
    minWidth: '400px',
    padding: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    overflowY: 'auto',
    zIndex: 1,
  },
}));
