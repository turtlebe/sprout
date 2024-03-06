import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  sticky: {
    position: 'sticky',
    left: '0px',
    background: 'white',
    zIndex: 1,
    whiteSpace: 'pre-wrap',
    width: '200px',
  },
  timeHeader: {
    minWidth: '200px',
  },
  valueCell: {
    width: '80px',
  },
}));
