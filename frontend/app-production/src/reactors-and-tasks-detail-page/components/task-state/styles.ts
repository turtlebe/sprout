import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(() => ({
  linearProgress: {
    flex: '0 0 auto',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
    marginBottom: '1rem',
    minHeight: 0,
  },
}));
