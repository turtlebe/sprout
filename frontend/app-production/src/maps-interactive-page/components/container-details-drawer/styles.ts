import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  ancestors: {
    lineHeight: 1,
  },
  closeIcon: {
    marginTop: theme.spacing(0.5),
  },
  fieldLabel: {
    lineHeight: 1,
    marginBottom: theme.spacing(0.75),
  },
  fieldValue: {
    fontSize: theme.typography.subtitle2.fontSize,
    marginBottom: theme.spacing(1.5),
  },
  instructions: {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  errorIcon: {
    verticalAlign: 'text-bottom',
  },
  treeView: {
    marginBottom: theme.spacing(1.5),
  },
  treeViewItem: {
    '& .MuiTreeItem-label': {
      fontSize: theme.typography.subtitle2.fontSize,
    },
  },
}));
