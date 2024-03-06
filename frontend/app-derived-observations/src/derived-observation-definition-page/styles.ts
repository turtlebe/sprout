import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  dependencyCard: {
    border: `1px solid ${theme.palette.success.light}`,
    borderRadius: theme.shape.borderRadius,
  },
}));
