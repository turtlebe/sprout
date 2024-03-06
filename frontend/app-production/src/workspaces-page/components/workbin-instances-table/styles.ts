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
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
  },
  dateSelector: {
    display: 'flex',
  },
}));
