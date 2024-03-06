import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles({
  dropdown: {
    marginLeft: '1rem',
    minWidth: '176px',
  },
  breadcrumbs: {
    '& .MuiBreadcrumbs-separator': {
      marginLeft: '5px',
      marginRight: '5px',
    },
    '& .MuiBreadcrumbs-ol': {
      flexWrap: 'nowrap',
    },
    whiteSpace: 'nowrap',
  },
  dropdownButton: {
    '& .MuiButton-label': {
      textTransform: 'none',
    },
    '& .MuiButton-endIcon': {
      marginLeft: '0',
    },
    padding: 0,
    minWidth: 'auto',
  },
});
