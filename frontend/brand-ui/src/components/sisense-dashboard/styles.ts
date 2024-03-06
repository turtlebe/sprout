import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  view: {
    height: '100%',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  linearProgress: {
    flex: '0 0 auto',
  },
  iframe: {
    marginTop: '1rem',
    border: 'none',
    flex: '1 1 auto',
    maxWidth: '1929px',
    alignSelf: 'center',
    width: '100%',
  },
}));
