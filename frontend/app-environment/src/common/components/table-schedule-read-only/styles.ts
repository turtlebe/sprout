import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  table: {
    tableLayout: 'fixed',
    overflowX: 'auto',
  },
  sticky: {
    position: 'sticky',
    left: '0px',
    background: 'white',
    zIndex: 1,
    whiteSpace: 'pre-wrap',
    width: '120px',
  },
}));
