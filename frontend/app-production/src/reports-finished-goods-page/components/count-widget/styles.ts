import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '4px',
    marginRight: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 100,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  name: {
    fontSize: '10px',
  },
  value: {
    fontSize: '24px',
  },
}));
