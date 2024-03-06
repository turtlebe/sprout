import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  clickableMetric: {
    border: 'none',
    borderBottom: '2px solid transparent',
    background: 'none',
    padding: 'none',
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      borderBottom: `2px solid ${theme.palette.grey[300]}`,
    },
    '&[aria-selected="true"]': {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
}));
