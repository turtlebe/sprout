import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export interface StyleProps {
  marginLeft?: string;
}

export const useStyles = makeStyles(() => ({
  root: {
    marginLeft: (props: StyleProps) => props.marginLeft,
    display: 'flex',
    alignItems: 'center',
  },
}));
