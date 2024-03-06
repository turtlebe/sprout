import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  cardHeaderRoot: {
    paddingBottom: 0,
  },
  cardHeaderTitle: {
    fontSize: '1rem',
  },
  cardContentRoot: {
    '&:last-child': {
      paddingBottom: 0,
    },
    paddingBottom: 0,
    paddingTop: 0,
  },
  expandIconButton: {
    padding: '4px',
  },
}));
