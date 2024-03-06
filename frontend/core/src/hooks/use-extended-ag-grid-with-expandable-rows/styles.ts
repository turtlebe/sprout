import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  '@global': {
    '.ag-theme-balham': {
      '& .ag-cell-expandable.ag-row-group': {
        alignItems: 'center',
        '& .ag-icon': {
          fontSize: '24px',
        },
      },
    },
  },
}));
