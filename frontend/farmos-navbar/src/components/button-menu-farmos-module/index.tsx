import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import React from 'react';

import { LinkFarmOsModule } from '../link-farmos-module';

export const dataTestIds = {
  root: 'button-menu-farmos-module-root',
  menu: 'button-menu-farmos-module-menu',
  menuItem: 'button-menuItem-farmos-module-menuItem',
};

const useStyles = makeStyles(theme => ({
  root: {
    color: 'inherit',
    fontSize: '1rem',
    textTransform: 'none',
  },
  menuItem: {
    color: theme.palette.text.primary,
    textTransform: 'none',
    paddingLeft: '1rem',
    paddingRight: '2rem',
  },
  activeClassName: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.secondary,
  },
}));

interface ButtonMenuFarmOsModule {
  farmOsModules: FarmOsModule[];
  groupName: string;
  className?: string;
}

/**
 * Sub-component used by <AppBar /> to render a generic profile Button on the right side.
 */
export const ButtonMenuFarmOsModule: React.FC<ButtonMenuFarmOsModule> = ({ farmOsModules, groupName, className }) => {
  // hooks
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);
  const classes = useStyles({});

  const ID = `button-menu-farmos-module-${groupName}`;

  // handlers
  const toggleMenu = (open: boolean) => (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(open ? event.currentTarget : null);
  };

  return (
    <>
      <Button
        data-testid={dataTestIds.root}
        aria-controls={Boolean(profileAnchor) ? ID : undefined}
        aria-haspopup="true"
        className={`${classes.root} ${className}`}
        endIcon={<ArrowDropDown />}
        onClick={toggleMenu(true)}
      >
        {groupName}
      </Button>
      <Menu
        id={ID}
        data-testid={dataTestIds.menu}
        open={Boolean(profileAnchor)}
        getContentAnchorEl={null}
        anchorEl={profileAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: -1,
          horizontal: 'right',
        }}
        onClose={toggleMenu(false)}
      >
        {farmOsModules.map(farmOsModule => (
          <MenuItem
            button
            className={classes.menuItem}
            component={LinkFarmOsModule}
            farmOsModule={farmOsModule}
            key={farmOsModule.label}
            activeClassName={classes.activeClassName}
            onClick={toggleMenu(false)}
            data-testid={dataTestIds.menuItem}
          >
            {farmOsModule.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
