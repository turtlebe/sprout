import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  jsonContent: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    whiteSpace: 'pre',
    borderRadius: 2,
    border: `1px solid ${theme.palette.grey[300]}`,
    overflowY: 'auto',
    maxHeight: '400px',
  },
}));
