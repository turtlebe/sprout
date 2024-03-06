import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: 'inherit',
    },
  },
}));
