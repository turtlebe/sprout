import { MenuItem, MenuItemProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface SplitButtonItem extends MenuItemProps<React.ElementType> {}

export const SplitButtonItem: React.FC<SplitButtonItem> = ({ ...props }) => {
  return <MenuItem {...props} button={true} />;
};
