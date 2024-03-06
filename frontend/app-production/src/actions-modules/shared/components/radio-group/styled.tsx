import { styled } from '@plentyag/brand-ui/src/material-ui/core';

export const RadioItemStyled = styled('div')<any, any>(({ theme, selected }) => ({
  color: selected ? theme.palette.primary.light : theme.palette.common.white,
  margin: 0,
}));
