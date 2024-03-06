import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(theme => ({
  progress: {
    alignSelf: 'center',
    display: (props: StyleProps) => (props.isLoading ? 'block' : 'none'),
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    pointerEvents: 'none',
    zIndex: theme.zIndex.snackbar,
  },
}));
