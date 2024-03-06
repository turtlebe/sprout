import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  container: {
    margin: '1rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: '1 1',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
}));
