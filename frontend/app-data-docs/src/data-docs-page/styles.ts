import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles({
  iframe: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    border: 'none',
  },
  linearProgress: {
    flex: '0 0 auto',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
});
