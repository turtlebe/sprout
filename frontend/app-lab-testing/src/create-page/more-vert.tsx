import { MoreVert } from '@material-ui/icons';
import { Box, IconButton, Menu, MenuItem } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const ITEM_HEIGHT = 48;

interface MoreVertMenu {
  options: string[];
  onSelectOption: (option: string) => void;
  isEdit: boolean;
}

export const MoreVertMenu: React.FC<MoreVertMenu> = React.memo(({ options, onSelectOption, isEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined>(undefined);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleSelectMenuItem = (selectedOption: string) => {
    handleClose();
    onSelectOption(selectedOption);
  };

  return (
    <Box visibility={isEdit ? 'hidden' : 'visible'}>
      <IconButton icon={MoreVert} onClick={handleClick} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option} onClick={() => handleSelectMenuItem(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
});
