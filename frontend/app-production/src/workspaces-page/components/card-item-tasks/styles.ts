import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  container: {
    padding: '0.25rem',
    marginBlockStart: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskButton: {
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitle: {
    flexGrow: 1,
  },
  taskDate: {
    color: theme.palette.grey[600],
    whiteSpace: 'nowrap',
    paddingLeft: theme.spacing(1),
  },
}));
