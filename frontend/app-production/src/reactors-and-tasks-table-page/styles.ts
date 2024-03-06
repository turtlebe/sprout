import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(theme => ({
  linearProgress: {
    flex: '0 0 auto',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  subTitle: {
    fontSize: theme.typography.subtitle2.fontSize,
    color: theme.palette.grey[600],
    fontWeight: theme.typography.fontWeightBold,
    margin: theme.spacing(2),
    marginBottom: 0,
  },
}));
