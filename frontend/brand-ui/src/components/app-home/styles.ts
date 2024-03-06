import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  illustration: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: '4px',
    padding: '2rem 4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    fontSize: '64px',
    textTransform: 'capitalize',
  },
}));
