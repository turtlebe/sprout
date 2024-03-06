import { ArrowDropDown } from '@material-ui/icons';
import { Button, Menu, MenuItem } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ResetGridOptions } from '../../interface-types';

export const dataTestIds = {
  button: 'button',
  menu: 'menu',
};

interface ResetGridMenu {
  tableApi?: LT.TableApi;
}

export const ResetGridMenu: React.FC<ResetGridMenu> = props => {
  const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined);

  const handleResetGridMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleResetGrid = (option: ResetGridOptions) => {
    props.tableApi?.resetGrid(option);
    handleClose();
  };

  const menuItems = Object.keys(ResetGridOptions).map(option => (
    <MenuItem key={option} onClick={() => handleResetGrid(ResetGridOptions[option])}>
      {ResetGridOptions[option]}
    </MenuItem>
  ));

  return (
    <>
      <Button
        data-testid={dataTestIds.button}
        variant={'contained'}
        endIcon={<ArrowDropDown />}
        onClick={handleResetGridMenuClick}
      >
        Reset Grid
      </Button>
      <Menu
        data-testid={dataTestIds.menu}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems}
      </Menu>
    </>
  );
};
