import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    width: '100%',
    background: 'rgba(245, 245, 245, 0.5)',
  },
}));
