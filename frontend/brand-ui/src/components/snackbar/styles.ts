import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  alert: {
    maxHeight: '25vh',
    maxWidth: 'calc(100vw - 50px)',
    overflowY: 'auto',

    '& .MuiAlert-message': {
      maxWidth: '80%',
    },
  },
}));
