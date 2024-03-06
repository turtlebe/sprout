import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

import { DEFAULT_COLLASPED_DRAWER_WIDTH } from './collapsable-drawer';

interface StyleProps {
  drawerWidth: string;
  open: boolean;
}

export const useStyles = makeStyles({
  mobileMenu: {
    marginLeft: '-1rem',
  },
  body: {
    minWidth: 0,
    flexGrow: 1,
    marginLeft: (props: StyleProps) =>
      props.open ? 0 : `calc(-1 * calc(${props.drawerWidth} - ${DEFAULT_COLLASPED_DRAWER_WIDTH}))`,
  },
});
