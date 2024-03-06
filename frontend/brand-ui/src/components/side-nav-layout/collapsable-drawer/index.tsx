import { OpenCloseToggle } from '@plentyag/brand-ui/src/components/open-close-toggle';
import { Paper } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Transition } from 'react-transition-group';

import { useStyles } from './styles';

export interface CollapsableDrawer {
  open: boolean;
  onToggle: () => void;
  drawerWidth?: string;
}

/**
 * Default duration of the Transition when collapsing/expanding the drawer.
 */
const DEFAULT_DURATION = 225;

/**
 * Default width of the drawer when collapsed.
 */
export const DEFAULT_COLLASPED_DRAWER_WIDTH = '1rem';

/**
 * Default width of the drawer when expanded.
 */
export const DEFAULT_DRAWER_WIDTH = '270px';

export const dataTestIds = {
  drawer: 'collapsable-drawer-root',
  toggle: 'collapsable-drawer-toggle',
};

export const CollapsableDrawer: React.FC<CollapsableDrawer> = ({
  open,
  onToggle,
  drawerWidth = DEFAULT_DRAWER_WIDTH,
  children,
}) => {
  const classes = useStyles({ drawerWidth });

  const defaultStyle = {
    transition: `transform ${DEFAULT_DURATION}ms ease-in-out`,
    transform: 'none',
    display: 'flex',
    flexShrink: 0,
  };
  const transitionStyles = {
    entering: { transform: 'none' },
    entered: { transform: 'none' },
    exiting: { transform: `translateX(-${drawerWidth}) translateX(${DEFAULT_COLLASPED_DRAWER_WIDTH})` },
    exited: {
      transform: `translateX(-${drawerWidth}) translateX(${DEFAULT_COLLASPED_DRAWER_WIDTH})`,
      height: '9999px', // hack to hide scrollbars when collapsed instead of changing the overflow.
    },
  };

  return (
    <Transition in={open} timeout={DEFAULT_DURATION}>
      {state => (
        <Paper
          square={true}
          classes={{ root: classes.paperRoot }}
          style={{ ...defaultStyle, ...transitionStyles[state] }}
          data-testid={dataTestIds.drawer}
        >
          {children}
          <OpenCloseToggle
            orientation="vertical"
            className={classes.openCloseToggle}
            open={open}
            onToggle={onToggle}
            data-testid={dataTestIds.toggle}
          />
        </Paper>
      )}
    </Transition>
  );
};
