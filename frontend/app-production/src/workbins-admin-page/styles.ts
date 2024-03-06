import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  container: {
    margin: '2rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toggleButton: {
    alignSelf: 'flex-end',
    position: 'relative',
    top: '-1rem',
    right: '1rem',
  },
  collapse: {
    overflowY: 'auto',
    overflowX: 'hidden',
    marginBottom: '2rem',
  },
  grid: {
    margin: 0,
  },
}));
