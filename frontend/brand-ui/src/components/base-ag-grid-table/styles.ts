import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

export const ROW_HEIGHT = 48;

export const useStyles = makeStyles(theme => ({
  '@global': {
    '.ag-theme-balham': {
      backgroundColor: 'transparent !important',
      '& .ag-root .ag-cell-focus': {
        userSelect: 'text',
      },

      '& .ag-cell-value': {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        fontSize: '14px',
        alignItems: 'center',
      },
      '& .ag-react-container': {
        width: '100%',
        height: '100%',
        display: 'flex',
      },
      '& .ag-cell:first-child': {
        justifyContent: 'flex-start',
      },
      '& .ag-body-viewport': {
        background: theme.palette.background.paper,
      },
      '& .ag-row.ag-full-width-row': {
        background: 'rgb(245, 247, 247)',
      },
    },
  },
}));
