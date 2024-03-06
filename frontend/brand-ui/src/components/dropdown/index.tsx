import { ArrowDropDown, MoreVert } from '@material-ui/icons';
import {
  Button,
  ButtonProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  button: 'dropdown-button',
  iconButton: 'dropdown-icon-button',
  menu: 'dropdown-menu',
};

export { dataTestIds as dataTestIdsDropdown };

export interface Dropdown extends ButtonProps {
  label?: React.ReactNode;
  icon?: React.ElementType;
  'data-testid'?: string;
  stopPropagation?: boolean;
  disabled?: boolean;
}

export { MenuItem as DropdownItem };
export { ListItemIcon as DropdownItemIcon };
export { ListItemText as DropdownItemText };

export const Dropdown: React.FC<Dropdown> = ({
  label,
  icon,
  children,
  'data-testid': dataTestId,
  stopPropagation = false,
  disabled = false,
  ...buttonProps
}) => {
  const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    setAnchorEl(undefined);
  };

  return (
    <>
      {label ? (
        <Button
          data-testid={dataTestId ?? dataTestIds.button}
          {...buttonProps}
          disabled={disabled}
          endIcon={<ArrowDropDown />}
          onClick={handleOpen}
        >
          {label}
        </Button>
      ) : (
        <IconButton
          data-testid={dataTestId ?? dataTestIds.iconButton}
          icon={icon ?? MoreVert}
          color="default"
          onClick={handleOpen}
          disabled={disabled}
        />
      )}

      <Menu
        data-testid={dataTestIds.menu}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
      >
        {children}
      </Menu>
    </>
  );
};
