import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    background: theme.palette.grey[100],
    whiteSpace: 'normal',
    overflow: 'auto',
  },
  layout: {
    display: 'flex',
    justifyContent: 'spacing-between',
    alignContent: 'flex-start',
    margin: theme.spacing(2),
    gap: theme.spacing(2),
  },
  divider: {
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    paddingLeft: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
    fontSize: '0.675rem',
    lineHeight: '1.5rem',
    color: theme.palette.grey[600],
    padding: 0,
    paddingBottom: '4px',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: 1.43,
  },
  byline: {
    color: theme.palette.grey[600],
  },
  content: {
    fontSize: '0.875rem',
    padding: '4px 0',
    lineHeight: 1.43,
    border: 'none',
  },
}));
