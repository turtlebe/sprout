import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  drawerWidth: string;
}

export const useStyles = makeStyles(theme => ({
  openCloseToggle: {
    position: 'absolute',
    right: '-1rem',
    top: '1rem',
  },
  paperRoot: {
    width: (props: StyleProps) => props.drawerWidth,
    backgroundColor: theme.palette.grey[100],
    position: 'relative',
    overflowY: 'unset',
    zIndex: theme.zIndex.appBar - 1,
  },
}));
