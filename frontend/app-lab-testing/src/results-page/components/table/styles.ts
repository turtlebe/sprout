import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  '@global': {
    '.ag-theme-balham ::-webkit-scrollbar': {
      '-webkit-appearance': 'none',
      width: '6px',
      height: '6px',
    },
    '.ag-theme-balham ::-webkit-scrollbar-thumb': {
      'border-radius': '4px',
      'background-color': 'rgba(0, 0, 0, 0.5)',
      'box-shadow': '0 0 1px rgba(255, 255, 255, 0.5)',
    },
    '.ag-theme-balham .ag-center-cols-viewport': {
      'overflow-x': 'hidden',
    },
    '.ag-theme-balham .ag-center-cols-viewport:hover': {
      'overflow-x': 'auto',
    },
    '.ag-root-wrapper': {
      // min height so filter menu is not cut-off, see: SD-5231
      minHeight: '300px',
    },
  },
  gridWrapper: {
    flex: '1 1',
    display: 'flex',
    flexDirection: 'column',
  },
}));
