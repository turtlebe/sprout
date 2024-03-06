import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  listObjectDetails: {
    padding: theme.spacing(1),
    color: 'black',
    whiteSpace: 'pre',
    borderRadius: 2,
    overflowY: 'auto',
    maxHeight: '400px',
  },

  listItemCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
