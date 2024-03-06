import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  selectAll: {
    background: '#f5f5f5',
    borderRadius: '4px',
    marginRight: '8px',
  },
  slider: {
    background: '#f5f5f5',
    flex: '1 1 auto',
    borderRadius: '4px',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  valueLabel: {
    top: '24px',
    '& *': {
      color: 'inherit',
      background: 'white',
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: '8px',
      padding: '4px',
      whiteSpace: 'nowrap',
    },
    '& > *': {
      color: 'none',
      background: 'none',
      border: 'none',
    },
    '&:after': {
      content: '"|"',
      color: 'transparent',
      borderLeft: `1px solid ${theme.palette.primary.main}`,
      position: 'absolute',
      left: '50%',
      top: '-10px',
      zIndex: 1,
    },
  },
}));
