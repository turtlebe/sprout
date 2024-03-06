import { ExpandLess, ExpandMore, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { IconButton, IconButtonProps } from '@plentyag/brand-ui/src/material-ui/core';
import clsx from 'clsx';
import React from 'react';

import { useStyles } from './styles';

interface OpenCloseButton extends Omit<IconButtonProps, 'children'> {
  orientation: 'horizontal' | 'vertical';
  open: boolean;
  onToggle: () => void;
  children?: undefined; // forbid adding children.
}

export const OpenCloseToggle: React.FC<OpenCloseButton> = ({ orientation, open, onToggle, className, ...props }) => {
  const classes = useStyles({});

  return (
    <IconButton
      {...props}
      size="small"
      className={clsx(classes.openCloseToggle, className)}
      icon={
        orientation === 'vertical' ? (open ? KeyboardArrowLeft : KeyboardArrowRight) : open ? ExpandMore : ExpandLess
      }
      onClick={onToggle}
    />
  );
};
