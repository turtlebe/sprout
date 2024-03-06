import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  expression: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(2),
    overflowWrap: 'break-word',
  },
  dependencyLink: {
    cursor: 'pointer',
  },
  dependencyLinkActive: {
    cursor: 'pointer',
    color: theme.palette.success.light,
    textDecoration: 'underline',
  },
}));
