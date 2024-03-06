import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export interface StyleProps {
  display?: CSSProperties['display'];
  width?: CSSProperties['width'];
}
export const useStyles = makeStyles(() => ({
  root: {
    display: ({ display = 'flex' }: StyleProps) => display,
    alignItems: 'center',
  },
  typography: {
    width: ({ width = '300px' }: StyleProps) => width,
  },
  tooltip: {
    fontSize: '11px',
    backgroundColor: 'rgb(97, 97, 97)',
  },
}));
