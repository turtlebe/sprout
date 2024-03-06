import { ButtonProps, Button as MuiButton, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';

export interface Button extends ButtonProps {}

export const Button = React.forwardRef<any, Button>(({ size, ...props }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const customSize = (() => {
    if (size === 'large') {
      return isMobile ? 'medium' : size;
    }
    return size;
  })();
  return <MuiButton ref={ref} {...props} size={customSize} color={props.color ?? 'primary'} />;
});
