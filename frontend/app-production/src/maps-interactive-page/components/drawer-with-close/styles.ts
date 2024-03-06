import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

const globalHeaderSize = 64;

interface StyleProps {
  drawerWidth?: number;
  rightOffset?: number;
}

export const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0,
  },
  drawerPaper: {
    width: (props: StyleProps) => props.drawerWidth || 'auto',
    height: `calc(100vh - ${globalHeaderSize}px)`,
    right: (props: StyleProps) => props.rightOffset || 0,
    marginTop: `${globalHeaderSize}px`,
    minWidth: (props: StyleProps) => props.drawerWidth || 'auto',
  },
  closeIcon: {
    marginTop: theme.spacing(0.5),
  },
}));
