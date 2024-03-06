import { ArrowDropDown } from '@material-ui/icons';
import {
  Button,
  ButtonGroup,
  ButtonProps,
  ClickAwayListener,
  MenuList,
  Paper,
  Popper,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

export const dataTestIds = {
  arrowDropDown: 'split-button-arrow-dropdown',
};

export interface SplitButton extends ButtonProps {
  label: string;
}

export { SplitButtonItem } from './components/split-button-item';

export const SplitButton: React.FC<SplitButton> = ({ label, children, ...buttonProps }) => {
  const classes = useStyles({});
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const anchorRef = React.useRef(null);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <ButtonGroup variant={buttonProps.variant} color={buttonProps.color} ref={anchorRef}>
        <Button {...buttonProps}>{label}</Button>
        <Button
          onClick={handleOpen}
          classes={{ root: classes.arrowDropDownRoot }}
          data-testid={dataTestIds.arrowDropDown}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper open={isOpen} anchorEl={anchorRef.current}>
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>{children}</MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
};
