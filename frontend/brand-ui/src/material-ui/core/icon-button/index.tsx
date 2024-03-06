import { IconButtonProps, IconButton as MuiIconButton, PropTypes } from '@material-ui/core';
import React from 'react';

export interface IconButton extends Omit<IconButtonProps, 'children' | 'color' | 'classes'> {
  icon: React.ElementType;
  children?: undefined;
  color?: PropTypes.Color;
  iconFontSize?: string;
}

export const IconButton = React.memo(
  React.forwardRef<HTMLButtonElement, IconButton>(({ icon: Icon, color, iconFontSize, ...props }: IconButton, ref) => {
    return (
      <MuiIconButton ref={ref} {...props} color={color ?? 'primary'}>
        <Icon fontSize={iconFontSize} />
      </MuiIconButton>
    );
  })
);
