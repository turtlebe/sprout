import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '0.5rem',
    position: 'relative',
    overflow: 'auto',
    whiteSpace: 'nowrap',
  },
  sticky: {
    [theme.breakpoints.up('md')]: { maxWidth: '180px' },
    position: 'sticky',
    left: '0px',
    background: 'white',
    zIndex: 1,
    whiteSpace: 'pre-wrap',
  },
}));
