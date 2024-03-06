import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  color?: string;
}

export const useStyles = makeStyles(() => ({
  typography: {
    color: (props: StyleProps) => props.color ?? 'rgba(84, 49, 121, 0.9)',
  },
}));
