import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4, 0),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    flex: '1 1 auto',
    height: '100%',
    overflowY: 'auto',
  },
}));
