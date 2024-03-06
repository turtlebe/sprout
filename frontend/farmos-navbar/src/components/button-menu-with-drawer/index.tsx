import { Button, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { KeyboardEvent, MouseEvent, useState } from 'react';

import { LinkFarmOsModule } from '../link-farmos-module';

export const dataTestIds = {
  root: 'app-bar-button-menu-with-drawer--root',
  drawer: 'app-bar-button-menu-with-drawer--drawer',
  listItem: 'app-bar-button-menu-with-drawer--list-item',
};

const useStyles = makeStyles(theme => ({
  root: {
    color: 'inherit',
  },
  menuItem: {
    color: theme.palette.text.primary,
    textTransform: 'none',
    paddingLeft: '1rem',
    paddingRight: '5rem',
  },
  activeClassName: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.secondary,
  },
}));

export interface ButtonMenuWithDrawer {
  farmOsModules: FarmOsModule[];
}
/**
 * Sub-component used by <AppBar /> to render a Button that opens a Drawer with all the FarmOs modules
 * as Navigational element.
 */
export const ButtonMenuWithDrawer: React.FC<ButtonMenuWithDrawer> = ({ farmOsModules }) => {
  // hooks
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const classes = useStyles({});

  // handlers
  const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (event.type === 'keydown' && ['Tab', 'Shift'].includes((event as KeyboardEvent).key)) {
      return;
    }

    setIsDrawerOpen(open);
  };

  return (
    <>
      <Button className={classes.root} onClick={toggleDrawer(true)} data-testid={dataTestIds.root}>
        <Menu />
      </Button>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)} data-testid={dataTestIds.drawer}>
        <List>
          {farmOsModules.map(farmOsModule => (
            <ListItem
              button
              component={LinkFarmOsModule}
              key={farmOsModule.label}
              farmOsModule={farmOsModule}
              onClick={toggleDrawer(false)}
              className={classes.menuItem}
              activeClassName={classes.activeClassName}
              data-testid={dataTestIds.listItem}
            >
              <ListItemText>{farmOsModule.label}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
