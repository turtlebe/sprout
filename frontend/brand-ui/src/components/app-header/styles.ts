import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export interface StyleProps {
  paddingBottom?: number;
  flexDirection?: React.CSSProperties['flexDirection'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
}

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: (props: StyleProps) => props.flexDirection,
    justifyContent: (props: StyleProps) => props.justifyContent ?? 'space-between',
    alignItems: (props: StyleProps) => props.alignItems ?? 'normal',
    padding: theme.spacing(2),
    paddingBottom: (props: StyleProps) => props.paddingBottom,
  },
}));
