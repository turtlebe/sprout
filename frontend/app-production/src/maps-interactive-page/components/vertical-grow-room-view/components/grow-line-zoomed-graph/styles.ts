import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  diagramContainer: {
    height: '100%',
    position: 'relative',
    overflow: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
