import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export interface StyleProps {
  doNotPadContent?: boolean;
}

export const useStyles = makeStyles(() => ({
  grid: {
    flex: '1 1 auto',
  },
  cardHeader: {
    paddingBottom: 0,
  },
  cardContent: {
    padding: ({ doNotPadContent }: StyleProps) => (doNotPadContent ? 0 : undefined),
    '&:last-child': {
      paddingBottom: ({ doNotPadContent }: StyleProps) => (doNotPadContent ? 0 : undefined),
    },
  },
  loader: {
    marginLeft: '4px',
  },
}));
