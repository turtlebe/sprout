import { Select, SelectProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

/**
 * Wrapper on material-ui Select to open the dropdown below the TextField
 *
 * @param @see SelectProps
 */
export const SelectDropdownDown: React.FC<SelectProps> = ({ children, ...props }) => {
  const classes = useStyles({});

  return (
    <Select
      {...props}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        getContentAnchorEl: null,
        classes: {
          paper: classes.paper,
        },
      }}
    >
      {children}
    </Select>
  );
};
