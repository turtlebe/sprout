import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(1),
    width: '350px',
  },
  wordBreak: {
    wordBreak: 'break-word',
  },
  tabsIndicator: {
    backgroundColor: theme.palette.grey[700],
  },
  tabRoot: {
    minWidth: 0,
    padding: 0,
  },
}));
